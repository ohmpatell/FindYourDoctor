const Clinic = require('../models/Clinic');
const asyncHandler = require('express-async-handler');


const getProvinces = asyncHandler(async (req,res)=> {
  try{
    const provinces = await Clinic.distinct('address.city');
    res.json(provinces);
  }
  catch(error){
    res.status(500).json({ error: error.message });
  }
});


module.exports = {
  getProvinces
}