const express = require('express');
const { login, registerUser, registerClinic, registerDoctor, logout, authMe } = require('../controllers/auth.controller');
const router = express.Router();

router.post('/login', login);
router.get('/me', authMe);
router.post('/logout', logout);
router.post('/register/user', registerUser);
router.post('/register/clinic', registerClinic);
router.post('/register/doctor', registerDoctor);

module.exports = router;