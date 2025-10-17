const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Profile name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters'],
        maxlength: [50, 'Name cannot exceed 50 characters']
    },
    timezone: {
        type: String,
        required: true,
        default: 'UTC'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for faster queries
profileSchema.index({ name: 1 });

module.exports = mongoose.model('Profile', profileSchema);

