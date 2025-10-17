const express = require('express');
const router = express.Router();
const {
    createProfile,
    getAllProfiles,
    getProfileById,
    updateProfile
} = require('../controllers/profileController');
const validate = require('../middleware/validate');
const { createProfileSchema, updateProfileSchema } = require('../validators/profileValidator');

router.post('/', validate(createProfileSchema), createProfile);
router.get('/', getAllProfiles);
router.get('/:id', getProfileById);
router.put('/:id', validate(updateProfileSchema), updateProfile);

module.exports = router;

