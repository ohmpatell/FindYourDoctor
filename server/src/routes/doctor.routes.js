const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor'); // Import the Doctor model

// GET all doctors
router.get('/doctors', async (req, res) => {
  try {
    const doctors = await Doctor.find().populate('clinic'); // Populate clinic details if needed
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching doctors', error });
  }
});

module.exports = router;