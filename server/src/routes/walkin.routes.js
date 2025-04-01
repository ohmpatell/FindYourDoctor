const express = require('express');
const router = express.Router();
const registerWalkIn = require ('../controllers/walkin.controller')

router.post('/register', registerWalkIn.registerWalkIn);

module.exports = router;