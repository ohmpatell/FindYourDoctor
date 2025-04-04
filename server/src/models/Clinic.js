const mongoose = require('mongoose');

const ClinicSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
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
  address: { 
    street: { type: String },
    city: { type: String},
    province: { type: String}
  },
  phoneNumber: { 
    type: String 
  },
  profileImage: {
    type: String,
    default: ''
  },
  operatingHours: {
    monday: { open: { type: String, default: '08:00' }, close: { type: String, default: '18:00' } },
    tuesday: { open: { type: String, default: '08:00' }, close: { type: String, default: '18:00' } },
    wednesday: { open: { type: String, default: '08:00' }, close: { type: String, default: '18:00' } },
    thursday: { open: { type: String, default: '08:00' }, close: { type: String, default: '18:00' } },
    friday: { open: { type: String, default: '08:00' }, close: { type: String, default: '18:00' } },
    saturday: { open: String, close: String },
    sunday: { open: String, close: String }
  },
  doctors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor'
  }],
  appointments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  }],
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

module.exports = mongoose.model('Clinic', ClinicSchema);
