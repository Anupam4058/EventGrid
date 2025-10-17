const { z } = require('zod');

const createEventSchema = z.object({
    title: z.string()
        .min(3, 'Title must be at least 3 characters')
        .max(100, 'Title cannot exceed 100 characters')
        .trim(),
    description: z.string()
        .max(500, 'Description cannot exceed 500 characters')
        .trim()
        .optional(),
    startTime: z.string().datetime(),
    endTime: z.string().datetime(),
    timezone: z.string(),
    profiles: z.array(z.string()).min(1, 'At least one profile must be selected'),
    createdBy: z.string()
}).refine(data => {
    const start = new Date(data.startTime);
    const end = new Date(data.endTime);
    return end > start;
}, {
    message: 'End time must be after start time',
    path: ['endTime']
});

const updateEventSchema = z.object({
    title: z.string()
        .min(3, 'Title must be at least 3 characters')
        .max(100, 'Title cannot exceed 100 characters')
        .trim()
        .optional(),
    description: z.string()
        .max(500, 'Description cannot exceed 500 characters')
        .trim()
        .optional(),
    startTime: z.string().datetime().optional(),
    endTime: z.string().datetime().optional(),
    timezone: z.string().optional(),
    profiles: z.array(z.string()).min(1, 'At least one profile must be selected').optional(),
    updatedBy: z.string()
}).refine(data => {
    if (data.startTime && data.endTime) {
        const start = new Date(data.startTime);
        const end = new Date(data.endTime);
        return end > start;
    }
    return true;
}, {
    message: 'End time must be after start time',
    path: ['endTime']
});

module.exports = {
    createEventSchema,
    updateEventSchema
};

