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
  bio: {
    type: String
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Doctor', DoctorSchema);
