const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const asyncHandler = require('express-async-handler');


/**
 * Get all doctors.
 */
const getAllDoctors = asyncHandler(async (req, res) => {
  try {
    const doctors = await Doctor.find({}).populate('clinic', 'name address');
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get a single doctor by ID.
 */
const getDoctorById = asyncHandler(async (req, res) => {
  try {
    const doctorId = req.params.id;
    const doctor = await Doctor.findById(doctorId).populate('clinic', 'name address');
    if (!doctor) return res.status(404).json({ error: 'Doctor not found' });
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get doctor availability for a specific date.
 * Expected query parameters: 
 *    - doctorId (the doctor's ObjectId)
 *    - date (a string in the format "YYYY-MM-DD")
 * 
 * Returns an object: { freeSlots: [9, 11, 12, ...] }
 */
const getDoctorAvailability = asyncHandler(async (req, res) => {
  try {
    const { doctorId, date } = req.query;
    if (!doctorId || !date) {
      return res.status(400).json({ error: 'doctorId and date are required' });
    }
    
    const queryDate = new Date(date);
    if (isNaN(queryDate)) {
      return res.status(400).json({ error: 'Invalid date format' });
    }
    
    const doctor = await Doctor.findById(doctorId).populate('clinic');
    if (!doctor) return res.status(404).json({ error: 'Doctor not found' });
    const clinic = doctor.clinic;
    if (!clinic) return res.status(404).json({ error: 'Clinic not found for this doctor' });

    const dayOfWeek = queryDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const dayHours = clinic.operatingHours[dayOfWeek];
    if (!dayHours || !dayHours.open || !dayHours.close) {
      return res.status(400).json({ error: `Clinic is closed on ${dayOfWeek}` });
    }
    
    const [openHourStr] = dayHours.open.split(':');
    const [closeHourStr] = dayHours.close.split(':');
    const openHour = parseInt(openHourStr, 10);
    const closeHour = parseInt(closeHourStr, 10);
    if (isNaN(openHour) || isNaN(closeHour)) {
      return res.status(400).json({ error: 'Invalid clinic operating hours' });
    }
    
    const allSlots = [];
    for (let hour = openHour; hour < closeHour; hour++) {
      allSlots.push(hour);
    }
    
    const startOfDay = new Date(queryDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(queryDate);
    endOfDay.setHours(23, 59, 59, 999);
    
    const appointments = await Appointment.find({
      doctor: doctorId,
      appointmentDate: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
      status: 'scheduled'
    });
    
    const bookedHours = appointments.map(app => {
      const appDate = new Date(app.appointmentDate);
      return appDate.getHours();
    });
    
    const freeSlots = allSlots.filter(hour => !bookedHours.includes(hour));
    
    res.json({ freeSlots });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const getSpecializations = asyncHandler(async (req, res) => {
  try{
    const specializations = await Doctor.distinct('specialization');
    res.json(specializations);
  }
  catch(error){
    res.status(500).json({error: error.message});
  }
})

const getScheduleAppointments = asyncHandler(async (req, res) => {
  const { doctorId, date } = req.body; 

  if (!doctorId || !date) {
    return res.status(400).json({ error: 'Missing required query parameters: doctorId and date.' });
  }

  if (isNaN(Date.parse(date))) {
    return res.status(400).json({ error: 'Invalid date format. Please use YYYY-MM-DD.' });
  }

  const startDate = new Date(date);
  startDate.setHours(0, 0, 0, 0);
  const endDate = new Date(date);
  endDate.setHours(23, 59, 59, 999);

  const doctor = await Doctor.findById(doctorId).populate({
    path: 'appointments',
    match: { appointmentDate: { $gte: startDate, $lte: endDate } },
    options: { sort: { appointmentDate: 1 } },
    populate: [
      { path: 'patient', select: 'firstName lastName email' },
      { path: 'clinic', select: 'name address' },
      { path: 'doctor', select: 'firstName lastName specialization' }
    ]
  });

  if (!doctor) {
    return res.status(404).json({ error: 'Doctor not found.' });
  }

  res.json(doctor.appointments);
});

module.exports = {
  getAllDoctors,
  getDoctorById,
  getDoctorAvailability,
  getSpecializations,
  getScheduleAppointments
};
