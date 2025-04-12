const auth = require('../../controllers/auth.controller');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const request = require('supertest');
const express = require('express');

jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

const authController = require('../../controllers/auth.controller');
const User = require('../../models/User');
const Clinic = require('../../models/Clinic');
const Doctor = require('../../models/Doctor');

jest.mock('../../models/User');
jest.mock('../../models/Clinic');
jest.mock('../../models/Doctor');

const app = express();
app.use(express.json());
app.post('/api/auth/register/user', authController.registerUser);
app.post('/api/auth/register/clinic', authController.registerClinic);
app.post('/api/auth/register/doctor', authController.registerDoctor);

describe('POST /api/auth/register/user', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const mockUser = {
        _id: '123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'hashedPassword',
        phoneNumber: '1234567890',
        profileImage: 'profile.jpg',
        role: 'USER',
        toJSON: function () {
          return this;
        }
    };

    it('should return 201 and set a cookie on successful registration', async () => {
        User.findOne.mockResolvedValue(null);
        bcrypt.hash.mockResolvedValue('hashedPassword');
        User.create.mockResolvedValue(mockUser);
        jwt.sign.mockReturnValue('fake-jwt-token');

        const res = await request(app)
            .post('/api/auth/register/user')
            .send({
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com',
                password: 'password123',
                phoneNumber: '1234567890',
                profileImage: 'profile.jpg',
            });
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('_id', mockUser._id);
        expect(res.headers['set-cookie']).toBeDefined();
    });

    it('should return 400 if user already exists', async () => {
        User.findOne.mockResolvedValue(mockUser);

        const res = await request(app)
            .post('/api/auth/register/user')
            .send({
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com',
                password: 'password123',
                phoneNumber: '1234567890',
                profileImage: 'profile.jpg',
            });
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe('User already exists');
    });

    it('should return 400 is required fields are missing', async () => {
        const res = await request(app)
            .post('/api/auth/register/user')
            .send({
                email: 'incomplete@example.com'
            });
        expect(res.statusCode).toBe(400);
    });
});

describe('POST /api/auth/register/clinic', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const mockClinic = {
        _id: '123',
        name: 'Test Clinic',
        email: 'clinic@example.com',
        password: 'hashedPassword',
        address: {
            city: 'City',
            street: 'Street',
            province: 'Province',
        },
        phoneNumber: '1234567890',
        profileImage: 'profile.jpg',
        role: 'CLINIC',
        toJSON: function () {
          return this;
        }
    };

    it('should return 201 and set a cookie on successful registration', async () => {
        Clinic.findOne.mockResolvedValue(null);
        bcrypt.hash.mockResolvedValue('hashedPassword');
        Clinic.create.mockResolvedValue(mockClinic);
        jwt.sign.mockReturnValue('fake-jwt-token');

        const res = await request(app)
            .post('/api/auth/register/clinic')
            .send({
                name: 'Test Clinic',
                email: 'clinic@example.com',
                password: 'password123',
                address: {
                    city: 'City',
                    street: 'Street',
                    province: 'Province',
                },
                phoneNumber: '1234567890',
                profileImage: 'profile.jpg',
            });
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('_id', mockClinic._id);
        expect(res.headers['set-cookie']).toBeDefined();
    });

    it('should return 400 if clinic already exists', async () => {
        const mockClinic = {
            _id: 'clinic123',
            email: 'clinic@example.com',
            name: 'Existing Clinic',
          }; //For testing purposes
        
        Clinic.findOne.mockResolvedValue(mockClinic);

        const res = await request(app)
            .post('/api/auth/register/clinic')
            .send({
                name: 'Existing Clinic',
                email: 'clinic@example.com',
                password: 'password123',
                address: {
                    city: 'City',
                    street: 'Street',
                    province: 'Province',
                },
                phoneNumber: '1234567890',
                profileImage: 'profile.jpg',
            });
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe('Clinic already exists');
    });

    it('should return 400 is required fields are missing', async () => {
        const res = await request(app)
            .post('/api/auth/register/clinic')
            .send({
                email: 'incomplete@example.com'
            });
        expect(res.statusCode).toBe(400);
    });
});
