const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const User = require('../models/User');

const asyncHandler = require('express-async-handler');

const createAppointment = asyncHandler(async (req, res) => {
    const { patientId, doctorId, appointmentDate, patientConcerns } = req.body;
    console.log(req.body);
    
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(400).json({ message: 'Doctor not found' });

    const clinicId = doctor.clinic._id;
    
    const patientExists = await User.findById(patientId);
    if(!patientExists) return res.status(400).json({message: 'Patient does not exist' });

    try{
        const appointment = await Appointment.create({
            patient: patientId,
            doctor: doctorId,
            clinic: clinicId,
            appointmentDate: new Date(appointmentDate),
            patientConcerns: patientConcerns 
        });

        await Doctor.findByIdAndUpdate(doctorId, {
            $push: {appointments: appointment._id}
        });

        await User.findByIdAndUpdate(patientId, {
            $push: {appointments: appointment._id}
        })
    
        res.status(201).json({
            message: 'Appointment created succesfully',
            appointment
        });
    }catch(error) {
        res.status(500).json({
            message: 'Error creating appointment',
            error: error.message
        });
    }
});

/**
 * Get all appointments for the logged-in user.
 * For USER: returns appointments where the user is the patient.
 * For DOCTOR: returns appointments where the user is the doctor.
 * For CLINIC: returns appointments where the clinic matches the logged-in clinic.
 */
const getAllAppointments = asyncHandler(async (req, res) => {
    try {
      const user = req.user; // Assuming your auth middleware attaches the user
      let appointments;
  
      if (user.role === 'USER') {
        appointments = await Appointment.find({ patient: user._id }).populate('patient doctor clinic');
      } else if (user.role === 'DOCTOR') {
        appointments = await Appointment.find({ doctor: user._id }).populate('patient doctor clinic');
      } else if (user.role === 'CLINIC') {
        appointments = await Appointment.find({ clinic: user._id }).populate('patient doctor clinic');
      } else {
        appointments = await Appointment.find({});
      }
  
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  /**
   * Get one appointment by its ID.
   */
  const getAppointmentById = asyncHandler(async (req, res) => {
    try {
      const appointmentId = req.params.id;
      const appointment = await Appointment.findById(appointmentId);
      if (!appointment) {
        return res.status(404).json({ error: 'Appointment not found' });
      }
      res.json(appointment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  /**
   * Edit an appointment.
   * Allows updating fields like status, and a "confirmed" flag.
   * Expected fields in req.body: e.g., { status: 'confirmed', confirmed: true, notes: 'Updated note' }
   */
  const editAppointment = asyncHandler(async (req, res) => {
    try {
      const appointmentId = req.params.id;
      const updates = req.body;
      const appointment = await Appointment.findByIdAndUpdate(appointmentId, updates, { new: true });
      if (!appointment) {
        return res.status(404).json({ error: 'Appointment not found' });
      }
      res.json(appointment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  /**
   * Delete an appointment.
   */
  const deleteAppointment = asyncHandler(async (req, res) => {
    try {
      const appointmentId = req.params.id;
      const appointment = await Appointment.findByIdAndDelete(appointmentId);
      if (!appointment) {
        return res.status(404).json({ error: 'Appointment not found' });
      }
      res.json({ message: 'Appointment deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });


module.exports = {
    createAppointment,
    getAllAppointments,
    getAppointmentById,
    editAppointment,
    deleteAppointment
}