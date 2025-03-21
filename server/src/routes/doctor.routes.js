const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor'); 

// GET all doctors
router.get('/', async (req, res) => {
  try {
    const doctors = await Doctor.find().populate('clinic');
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching doctors', error });
  }
});

// GET single doctor detail
router.get('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate('clinic');
    res.status(200).json(doctor);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching doctor detail', error });
  }
});

module.exports = router;
