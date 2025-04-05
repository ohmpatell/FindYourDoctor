const Clinic = require('../models/Clinic');
const asyncHandler = require('express-async-handler');
const Doctor = require('../models/Doctor');


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

module.exports = {
  getProvinces,
  getDoctors
}