const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');

// Get all doctors for the logged-in clinic
exports.getDoctorsForClinic = async (req, res) => {
  try {
    const doctors = await Doctor.find({ clinic: req.user._id });
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch doctors' });
  }
};

// Get today's appointments
exports.getTodaysAppointments = async (req, res) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const appointments = await Appointment.find({
      clinic: req.user._id,
      appointmentDate: { $gte: start, $lte: end }
    }).populate('doctor').populate('patient');

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch appointments' });
  }
};

// Get appointments for specific doctor
exports.getAppointmentsByDoctor = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      doctor: req.params.doctorId
    }).populate('patient');

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch appointments' });
  }
};
