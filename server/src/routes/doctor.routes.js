const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctor.controller');
const { protect } = require('../middlewares/auth.middleware');

router.get('/availability', protect, doctorController.getDoctorAvailability);
router.get('/specializations', protect, doctorController.getSpecializations);
router.get('/', protect, doctorController.getAllDoctors);
router.get('/:id', protect, doctorController.getDoctorById);
router.post('/schedule', doctorController.getScheduleAppointments);

module.exports = router;
