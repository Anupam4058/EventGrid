const express = require('express');
const router = express.Router();
const {
    createEvent,
    getAllEvents,
    getEventById,
    updateEvent,
    deleteEvent
} = require('../controllers/eventController');
const { getEventLogs } = require('../controllers/eventLogController');
const validate = require('../middleware/validate');
const { createEventSchema, updateEventSchema } = require('../validators/eventValidator');

router.post('/', validate(createEventSchema), createEvent);
router.get('/', getAllEvents);
router.get('/:id', getEventById);
router.put('/:id', validate(updateEventSchema), updateEvent);
router.delete('/:id', deleteEvent);
router.get('/:id/logs', getEventLogs);

module.exports = router;

