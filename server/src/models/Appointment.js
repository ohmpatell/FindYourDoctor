const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  clinic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Clinic'
  },
  appointmentDate: {
    type: Date,
    required: true
  },
  patientConcerns: {
    type: String,
    required: true,
    default: ''
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  doctorsNotes: {
    type: String,
    default: ''
  },
  prescription: {
    type: String,
    default: ''
  },
  testsPrescribed: [{
    testName: { 
      type: String 
    },
    details: { 
      type: String 
    },
    testResults: { 
      type: String 
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Appointment', AppointmentSchema);
