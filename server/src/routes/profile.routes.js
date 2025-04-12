const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth.middleware');
const { updateProfile } = require('../controllers/profile.controller');

router.put('/', protect, updateProfile);

module.exports = router;
