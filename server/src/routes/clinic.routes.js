const express = require('express');
const router = express.Router();
const clinicController = require('../controllers/clinic.controller');
const { protect } = require('../middlewares/auth.middleware');


router.get('/doctors', protect, clinicController.getDoctorsForClinic);
router.get('/appointments/today', protect, clinicController.getTodaysAppointments);
router.get('/appointments/doctor/:doctorId', protect, clinicController.getAppointmentsByDoctor);

module.exports = router;
