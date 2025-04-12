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
app.post('/api/auth/login', authController.login);

describe('POST /api/auth/login', () => {
    const mockUser = {
      _id: '123',
      email: 'user@example.com',
      password: 'hashedpassword',
      toJSON: function () {
        return this;
      },
    };
  
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it('should return 200 and set cookie when login is successful for user', async () => {
      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('fake-jwt-token');
  
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'user@example.com', password: 'password123' });
  
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('_id', mockUser._id);
      expect(res.headers['set-cookie']).toBeDefined();
    });
  
    it('should return 401 if email is not found in all models', async () => {
      User.findOne.mockResolvedValue(null);
      Clinic.findOne.mockResolvedValue(null);
      Doctor.findOne.mockResolvedValue(null);
  
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'nonexistent@example.com', password: 'password123' });
  
      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe('Invalid email or password');
    });
  
    it('should return 401 if password does not match', async () => {
      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);
  
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'user@example.com', password: 'wrongpassword' });
  
      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe('Invalid password');
    });
});
