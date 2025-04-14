const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctor.controller');
const { protect } = require('../middlewares/auth.middleware');

router.get('/availability',  doctorController.getDoctorAvailability);
router.get('/specializations',  doctorController.getSpecializations);
router.get('/', doctorController.getAllDoctors);
router.get('/:id', doctorController.getDoctorById);
router.post('/schedule', doctorController.getScheduleAppointments);

module.exports = router;
