const Clinic = require('../models/Clinic');
const asyncHandler = require('express-async-handler');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');


const getProvinces = asyncHandler(async (req,res)=> {
  try{
    const provinces = await Clinic.distinct('address.city');
    res.json(provinces);
  }
  catch(error){
    res.status(500).json({ error: error.message });
  }
});

const getDoctors = asyncHandler(async (req,res)=> {
  const clinicId = req.user._id; // Assuming you have the clinicId in the request body or query
  console.log(clinicId);
  if (!(req.user instanceof Clinic)) {
    return res.status(400).json({ error: 'clinicId is required' });
  }
  try {
    const doctors = await Doctor.find({ clinic: clinicId }, 'firstName lastName specialization profileImage');
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const getTodaysAppointments = asyncHandler(async (req, res) => {
  const { clinicId, date } = req.body;
  if (!clinicId || !date) {
    res.status(400).json({ error: 'Missing required query parameters: clinicId and date.' });
    return;
  }

  const clinic = await Clinic.findById(clinicId);
  if (!clinic) {
    res.status(404).json({ error: 'Clinic not found.' });
    return;
  }


  if (isNaN(Date.parse(date))) {
    res.status(400).json({ error: 'Invalid date format. Please use YYYY-MM-DD.' });
    return;
  }

  const appointments = await Appointment.find({
    clinic: clinicId,
    appointmentDate: new Date(date),
  })
    .populate('patient clinic doctor')
    .sort({ appointmentDate: 1 });

  res.json(appointments);
});

module.exports = {
  getProvinces,
  getDoctors,
  getTodaysAppointments,
}