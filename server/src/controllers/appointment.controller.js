const Appointment = require('../models/Appointment');
const Clinic = require('../models/Clinic');
const Doctor = require('../models/Doctor');
const User = require('../models/User');

const asyncHandler = require('express-async-handler');

const createAppointment = asyncHandler(async (req, res) => {
    const { patientId, doctorId, clinicId, appointmentDate, patientConcerns } = req.body;

    const clinic = await Clinic.findById(clinicId);
    if (!clinic) return res.status(400).json({message: 'Clinic does not exist' });

    const doctorExists = await Doctor.findById(doctorId);
    if (!doctorExists) return res.status(400).json({message: 'Doctor does not exist' });

    const patientExists = await User.findById(patientId);
    if(!patientExists) return res.status(400).json({message: 'Patient does not exist' });

    try{
        const appointment = await Appointment.create({
            patientId,
            doctorId,
            clinicId,
            appointmentDate,
            patientConcerns
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

module.exports = {
    createAppointment
}