const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET } = require('../config/config');
const asyncHandler = require('express-async-handler');
const Clinic = require('../models/Clinic');
const Doctor = require('../models/Doctor');

const protect = asyncHandler(async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // Find user from any model (adjust as necessary)
    req.user = await User.findById(decoded.id) ||
               await Clinic.findById(decoded.id) ||
               await Doctor.findById(decoded.id);
    if (!req.user) {
      res.status(401);
      throw new Error('Not authorized, user not found');
    }
    next();
  } catch (error) {
    res.status(401);
    throw new Error('Not authorized, token failed');
  }
});

module.exports = { protect };
