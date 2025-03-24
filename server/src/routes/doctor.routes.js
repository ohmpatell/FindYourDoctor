const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctor.controller');

router.get('/availability', doctorController.getDoctorAvailability);
router.get('/', doctorController.getAllDoctors);
router.get('/:id', doctorController.getDoctorById);

module.exports = router;
