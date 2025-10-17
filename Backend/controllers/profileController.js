const Profile = require('../models/Profile');

// Create a new profile
const createProfile = async (req, res, next) => {
    try {
        const { name, timezone } = req.body;

        // Check if profile with same name already exists
        const existingProfile = await Profile.findOne({ name });
        if (existingProfile) {
            return res.status(400).json({
                success: false,
                message: 'Profile with this name already exists'
            });
        }

        const profile = await Profile.create({
            name,
            timezone: timezone || 'UTC'
        });

        res.status(201).json({
            success: true,
            message: 'Profile created successfully',
            data: profile
        });
    } catch (error) {
        next(error);
    }
};

// Get all profiles
const getAllProfiles = async (req, res, next) => {
    try {
        const profiles = await Profile.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: profiles.length,
            data: profiles
        });
    } catch (error) {
        next(error);
    }
};

// Get single profile by ID
const getProfileById = async (req, res, next) => {
    try {
        const profile = await Profile.findById(req.params.id);

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'Profile not found'
            });
        }

        res.status(200).json({
            success: true,
            data: profile
        });
    } catch (error) {
        next(error);
    }
};

// Update profile
const updateProfile = async (req, res, next) => {
    try {
        const { name, timezone } = req.body;

        // If name is being updated, check for duplicates
        if (name) {
            const existingProfile = await Profile.findOne({ 
                name, 
                _id: { $ne: req.params.id } 
            });
            if (existingProfile) {
                return res.status(400).json({
                    success: false,
                    message: 'Profile with this name already exists'
                });
            }
        }

        const profile = await Profile.findByIdAndUpdate(
            req.params.id,
            { name, timezone },
            { new: true, runValidators: true }
        );

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'Profile not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: profile
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createProfile,
    getAllProfiles,
    getProfileById,
    updateProfile
};

