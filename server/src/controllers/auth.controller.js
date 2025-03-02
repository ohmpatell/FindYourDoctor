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

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid password' });

    res.json({
        _id: user._id,
        user: user,
        token: generateToken(user._id)  
    })
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

    res.status(201).json({
        _id: user._id,
        user: user,
        token: generateToken(user._id)
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
    const { name, email, password, phoneNumber, address, profileImage } = req.body;

    const clinicExists = await Clinic.findOne({ email });
    if (clinicExists) return res.status(400).json({ message: 'Clinic already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const clinic = await Clinic.create({
        name,
        email,
        password: hashedPassword,
        address,
        phoneNumber,
        profileImage,
        role: 'CLINIC'
    });

    res.status(201).json({
        _id: clinic._id,
        user: clinic,
        token: generateToken(clinic._id)
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
    login,
    registerUser,
    registerClinic,
    registerDoctor
};