const User = require('../models/User');

// GET /api/profile
const getProfile = async (req, res) => {
  // onle for user now, can add other role to view later
  if (req.user.role !== 'USER') {
    return res.status(403).json({ message: 'Access denied.' });
  }

  res.json({
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    email: req.user.email,
    phoneNumber: req.user.phoneNumber,
    profileImage: req.user.profileImage,
    role: req.user.role,
    createdAt: req.user.createdAt,
  });
};

// PUT /api/profile
const updateProfile = async (req, res) => {
  const updates = req.body;

  //check role
  if (req.user.role !== 'USER') {
    return res.status(403).json({ message: 'Access denied.' });
  }

  const allowedFields = ['firstName', 'lastName', 'phoneNumber', 'profileImage'];
  const filteredUpdates = {};

  allowedFields.forEach(field => {
    if (updates[field] !== undefined) {
      filteredUpdates[field] = updates[field];
    }
  });

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { $set: filteredUpdates },
    { new: true }
  );

  res.json({
    message: 'Profile updated successfully',
    user: {
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      phoneNumber: updatedUser.phoneNumber,
      profileImage: updatedUser.profileImage,
    }
  });
};

module.exports = {
  getProfile,
  updateProfile
};
