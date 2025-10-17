const { z } = require('zod');

const createProfileSchema = z.object({
    name: z.string()
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name cannot exceed 50 characters')
        .trim(),
    timezone: z.string().optional().default('UTC')
});

const updateProfileSchema = z.object({
    name: z.string()
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name cannot exceed 50 characters')
        .trim()
        .optional(),
    timezone: z.string().optional()
});

module.exports = {
    createProfileSchema,
    updateProfileSchema
};

