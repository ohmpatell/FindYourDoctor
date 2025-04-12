const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Clinic = require('../models/Clinic');
const asyncHandler = require('express-async-handler');

// PUT /api/profile
const updateProfile = asyncHandler(async (req, res) => {
  const user = req.user; 
  const updates = req.body; 

  let updatedUser;
  
  if (user.role === 'DOCTOR') {
    const doctorUpdates = {
      firstName: updates.firstName,
      lastName: updates.lastName,
      profileImage: updates.profileImage,
      specialization: updates.specialization,
      credentials: updates.credentials,
      bio: updates.bio,
    };
    updatedUser = await Doctor.findByIdAndUpdate(user._id, doctorUpdates, { new: true });
  } else if (user.role === 'CLINIC') {
    const clinicUpdates = {
      name: updates.name,
      phoneNumber: updates.phoneNumber,
      profileImage: updates.profileImage,
      address: updates.address, 
      operatingHours: updates.operatingHours, 
    };
    updatedUser = await Clinic.findByIdAndUpdate(user._id, clinicUpdates, { new: true });
  } else {
    const userUpdates = {
      firstName: updates.firstName,
      lastName: updates.lastName,
      phoneNumber: updates.phoneNumber,
      gender: updates.gender,
      dob: updates.dob,
      address: updates.address,
    };
    updatedUser = await User.findByIdAndUpdate(user._id, userUpdates, { new: true });
  }

  if (updatedUser) {
    res.status(200).json({
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

module.exports = {
  updateProfile
};
