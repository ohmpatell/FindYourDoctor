const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointment.controller');
const { protect } = require('../middlewares/auth.middleware');

router.post('/', protect,appointmentController.createAppointment);
router.get('/', protect,appointmentController.getAllAppointments);
router.get('/:id', protect,appointmentController.getAppointmentById);
router.put('/:id', protect,appointmentController.editAppointment);
router.delete('/:id', protect,appointmentController.deleteAppointment);

module.exports = router;
