const Event = require('../models/Event');
const EventLog = require('../models/EventLog');
const Profile = require('../models/Profile');

// Create a new event
const createEvent = async (req, res, next) => {
    try {
        const { title, description, startTime, endTime, timezone, profiles, createdBy } = req.body;

        // Verify all profiles exist
        const profileDocs = await Profile.find({ _id: { $in: profiles } });
        if (profileDocs.length !== profiles.length) {
            return res.status(400).json({
                success: false,
                message: 'One or more profiles not found'
            });
        }

        // Create event with times already in UTC (frontend converts them)
        const event = await Event.create({
            title,
            description,
            startTime: new Date(startTime),
            endTime: new Date(endTime),
            timezone,
            profiles,
            createdBy
        });

        // Populate profiles
        await event.populate('profiles');

        res.status(201).json({
            success: true,
            message: 'Event created successfully',
            data: event
        });
    } catch (error) {
        next(error);
    }
};

// Get all events (with optional profile filter)
const getAllEvents = async (req, res, next) => {
    try {
        const { profileId } = req.query;
        
        let query = {};
        if (profileId) {
            query.profiles = profileId;
        }

        const events = await Event.find(query)
            .populate('profiles')
            .sort({ startTime: 1 });

        res.status(200).json({
            success: true,
            count: events.length,
            data: events
        });
    } catch (error) {
        next(error);
    }
};

// Get single event by ID
const getEventById = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id).populate('profiles');

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        res.status(200).json({
            success: true,
            data: event
        });
    } catch (error) {
        next(error);
    }
};

// Update event
const updateEvent = async (req, res, next) => {
    try {
        const { title, description, startTime, endTime, timezone, profiles, updatedBy } = req.body;

        // Get the existing event
        const oldEvent = await Event.findById(req.params.id);
        if (!oldEvent) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        // Track changes for logging
        const changes = [];

        if (title && title !== oldEvent.title) {
            changes.push({
                field: 'title',
                oldValue: oldEvent.title,
                newValue: title
            });
        }

        if (description !== undefined && description !== oldEvent.description) {
            changes.push({
                field: 'description',
                oldValue: oldEvent.description,
                newValue: description
            });
        }

        if (startTime) {
            const newStart = new Date(startTime);
            if (newStart.getTime() !== oldEvent.startTime.getTime()) {
                changes.push({
                    field: 'startTime',
                    oldValue: oldEvent.startTime.toISOString(),
                    newValue: newStart.toISOString()
                });
            }
        }

        if (endTime) {
            const newEnd = new Date(endTime);
            if (newEnd.getTime() !== oldEvent.endTime.getTime()) {
                changes.push({
                    field: 'endTime',
                    oldValue: oldEvent.endTime.toISOString(),
                    newValue: newEnd.toISOString()
                });
            }
        }

        if (timezone && timezone !== oldEvent.timezone) {
            changes.push({
                field: 'timezone',
                oldValue: oldEvent.timezone,
                newValue: timezone
            });
        }

        if (profiles) {
            const oldProfileIds = oldEvent.profiles.map(p => p.toString()).sort();
            const newProfileIds = profiles.sort();
            if (JSON.stringify(oldProfileIds) !== JSON.stringify(newProfileIds)) {
                changes.push({
                    field: 'profiles',
                    oldValue: oldProfileIds,
                    newValue: newProfileIds
                });
            }
        }

        // Verify all profiles exist if profiles are being updated
        if (profiles) {
            const profileDocs = await Profile.find({ _id: { $in: profiles } });
            if (profileDocs.length !== profiles.length) {
                return res.status(400).json({
                    success: false,
                    message: 'One or more profiles not found'
                });
            }
        }

        // Update the event
        const updateData = {};
        if (title) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (startTime) updateData.startTime = new Date(startTime);
        if (endTime) updateData.endTime = new Date(endTime);
        if (timezone) updateData.timezone = timezone;
        if (profiles) updateData.profiles = profiles;
        updateData.updatedAt = new Date();

        const event = await Event.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        ).populate('profiles');

        // Create log entry if there were changes
        if (changes.length > 0) {
            await EventLog.create({
                eventId: event._id,
                changes,
                updatedBy: updatedBy || 'Unknown',
                updatedAt: new Date()
            });
        }

        res.status(200).json({
            success: true,
            message: 'Event updated successfully',
            data: event
        });
    } catch (error) {
        next(error);
    }
};

// Delete event
const deleteEvent = async (req, res, next) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        // Also delete associated logs
        await EventLog.deleteMany({ eventId: req.params.id });

        res.status(200).json({
            success: true,
            message: 'Event deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createEvent,
    getAllEvents,
    getEventById,
    updateEvent,
    deleteEvent
};

