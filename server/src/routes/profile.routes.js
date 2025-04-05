const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth.middleware');
const { getProfile, updateProfile } = require('../controllers/profile.controller');

router.get('/', protect, getProfile);
router.put('/', protect, updateProfile);

module.exports = router;
