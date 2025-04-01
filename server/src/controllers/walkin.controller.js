const User = require('../models/User');

const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');

const generateTempPassword = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#'; // Exclude ambiguous chars
  let password = '';
  for (let i = 0; i < 10; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password; // Example: "V7m8!k2@Lp"
};

/**
 * @desc Register walk-in patient
 * @route POST /api/walk-ins/register
 */

const registerWalkIn = asyncHandler (async (req,res) => {
  const {firstName, lastName, email} = req.body;

  const userExists = await User.findOne({email});
  if (userExists) return res.status(400).json({message: 'User already exists'});

  const tempPassword = generateTempPassword();
  const hashedPassword = await bcrypt.hash(tempPassword, 10);

  const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: 'USER'
  });

  res.status(201).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      tempPassword: tempPassword
  });
});

module.exports = {
    registerWalkIn
};