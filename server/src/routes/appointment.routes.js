const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointment.controller');

router.post('/', appointmentController.createAppointment);
router.get('/', appointmentController.getAllAppointments);
router.get('/:id', appointmentController.getAppointmentById);
router.put('/:id', appointmentController.editAppointment);
router.delete('/:id', appointmentController.deleteAppointment);

module.exports = router;
