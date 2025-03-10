const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
  firstName: { 
    type: String, 
    required: true 
  },
  lastName: { 
    type: String, 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  password: { 
    type: String, 
    required: true 
  },
  profileImage: {
    type: String,
    default: ''
  },
  specialization: { 
    type: String,
    required: true 
  },
  credentials: {
    type: String,
  },
  clinic: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Clinic'
  },
  appointments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  }],
  availability: {
    monday: { open: String, close: String },
    tuesday: { open: String, close: String },
    wednesday: { open: String, close: String },
    thursday: { open: String, close: String },
    friday: { open: String, close: String },
    saturday: { open: String, close: String },
    sunday: { open: String, close: String }
  },
  bio: {
    type: String
  },
  role: {
    type: String,
    enum: ['USER', 'DOCTOR', 'CLINIC'],
    default: 'USER',
    required: true
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Doctor', DoctorSchema);
