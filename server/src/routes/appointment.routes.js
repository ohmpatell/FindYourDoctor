const express = require('express');
// const {protect} = require('../middlewares/auth.middleware');
const { createAppointment } = require('../controllers/appointment.controller')
const router = express.Router();

router.post('/create',createAppointment);
module.exports = router;