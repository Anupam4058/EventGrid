const mongoose = require('mongoose');

const eventLogSchema = new mongoose.Schema({
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    changes: [{
        field: {
            type: String,
            required: true
        },
        oldValue: {
            type: mongoose.Schema.Types.Mixed
        },
        newValue: {
            type: mongoose.Schema.Types.Mixed
        }
    }],
    updatedBy: {
        type: String,
        required: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Index for faster queries by event
eventLogSchema.index({ eventId: 1, updatedAt: -1 });

module.exports = mongoose.model('EventLog', eventLogSchema);

