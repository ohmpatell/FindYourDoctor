const express = require('express');
const router = express.Router();
const clinicController = require('../controllers/clinic.controller');
const { protect } = require('../middlewares/auth.middleware');

router.get('/provinces',clinicController.getProvinces)
router.get('/doctors',protect, clinicController.getDoctors);
router.post('/appointments/today',protect, clinicController.getTodaysAppointments);

module.exports = router;
