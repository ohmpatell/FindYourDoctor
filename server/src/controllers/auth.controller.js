const User = require('../models/User');
const Clinic = require('../models/Clinic');
const Doctor = require('../models/Doctor');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config');
const asyncHandler = require('express-async-handler');

const generateToken = (id) => {
    return jwt.sign({ id }, JWT_SECRET, {
        expiresIn: '30d'
    });
};

const authMe = asyncHandler(async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
      return res.status(200).json({ message: 'Not authorized' });
    }
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      let user = await User.findById(decoded.id) ||
                 await Clinic.findById(decoded.id) ||
                 await Doctor.findById(decoded.id);
      if (!user) {
        return res.status(200).json({ message: 'User not found' });
      }
      res.json({ user });
    } catch (error) {
      res.status(200).json({ message: 'Not authorized here' });
    }
  });
  

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 * @param   {String} email
 * @param   {String} password
 * @returns {Object} user, token
 * 
 */
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      user = await Clinic.findOne({ email });
      if (!user) {
        user = await Doctor.findOne({ email });
        if (!user) {
          return res.status(401).json({ message: 'Invalid email or password' });
        }
      }
    }
  
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid password' });
  
    const token = generateToken(user._id);
  
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
  
    res.json({
      _id: user._id,
      user: user,
      role: user instanceof Clinic ? 'clinic' : user instanceof Doctor ? 'doctor' : 'user'
      // Token is now in a cookie, so you can omit it from the JSON response if desired
    });
  });
  
  
  const logout = asyncHandler(async (req, res) => {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    res.json({ message: 'Logged out' });
  });
  

/**
 * @desc    Register user
 * @route   POST /api/auth/register/user
 * @access  Public
 * @param   {String} firstName
 * @param   {String} lastName
 * @param   {String} email
 * @param   {String} password
 * @param   {String} phoneNumber
 * @returns {Object} user, token
 */

const registerUser = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, password, phoneNumber, profileImage } = req.body;
  
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });
  
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phoneNumber,
      profileImage,
      role: 'USER'
    });
  
    const token = generateToken(user._id);
  
    // Set token in cookie to auto-login
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
  
    res.status(201).json({
      _id: user._id,
      user: user,
    });
  });
  


/**
 * @desc    Register clinic
 * @route   POST /api/auth/register/clinic
 * @access  Public
 * @param   {String} name
 * @param   {String} email
 * @param   {String} password
 * @param   {String} phoneNumber
 * @param   {String} address
 * @returns {Object} clinic, token
 */

const registerClinic = asyncHandler(async (req, res) => {
    const { name, email, password, phoneNumber, street, city, province, profileImage } = req.body;
  
    const clinicExists = await Clinic.findOne({ email });
    if (clinicExists) return res.status(400).json({ message: 'Clinic already exists' });
  
    const hashedPassword = await bcrypt.hash(password, 10);
    const clinic = await Clinic.create({
      name,
      email,
      password: hashedPassword,
      address: {
        city,
        street,
        province,
      },
      phoneNumber,
      profileImage,
      role: 'CLINIC'
    });
  
    const token = generateToken(clinic._id);
  
    // Set token in cookie to auto-login
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
  
    res.status(201).json({
      _id: clinic._id,
      user: clinic,
    });
  });
  


/**
 * @desc    Register doctor (By a clinic)
 * @route   POST /api/auth/register/doctor
 * @access  Private (only clinic can register doctor)
 * @param   {String} firstName
 * @param   {String} lastName
 * @param   {String} email
 * @param   {String} password
 * @param   {String} specialization
 * @param   {String} clinicId
 * @returns {Object} doctor
 */
const registerDoctor = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, password, specialization, clinicId, profileImage } = req.body;

    const clinic = await Clinic.findById(clinicId);
    if (!clinic) return res.status(400).json({ message: 'Clinic does not exist' });

    const doctorExists = await Doctor.findOne({ email });
    if (doctorExists) return res.status(400).json({ message: 'Doctor already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const doctor = await Doctor.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        specialization,
        profileImage,
        clinic: clinicId,
        role: 'DOCTOR'
    });

    clinic.doctors.push(doctor._id);
    await clinic.save();

    res.status(201).json({
        _id: doctor._id,
        doctor: doctor,
    });
});

module.exports = {
    authMe,
    login,
    logout,
    registerUser,
    registerClinic,
    registerDoctor
};