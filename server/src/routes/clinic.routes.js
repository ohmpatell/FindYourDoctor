const express = require('express');
const router = express.Router();
const clinicController = require('../controllers/clinic.controller');

router.get('/provinces',clinicController.getProvinces)

module.exports = router;
