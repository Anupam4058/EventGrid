const EventLog = require('../models/EventLog');
const Event = require('../models/Event');

// Get all logs for a specific event
const getEventLogs = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Verify event exists
        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        // Get all logs for this event
        const logs = await EventLog.find({ eventId: id })
            .sort({ updatedAt: -1 });

        res.status(200).json({
            success: true,
            count: logs.length,
            data: logs
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getEventLogs
};

