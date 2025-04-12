const request = require('supertest'); 
const express = require('express'); 

const authController = require('../../controllers/auth.controller');

const app = express(); 
app.use(express.json()); 

app.post('/api/auth/logout', authController.logout);

describe('POST /api/auth/logout', () => {
  it('should clear the token cookie and return success message', async () => {
    const res = await request(app)
      .post('/api/auth/logout')
      .set('Cookie', ['token=fake-token'])
      .send();

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: 'Logged out' });

    // 3. Verify cookie clearing
    const cookie = res.headers['set-cookie'][0];
    expect(cookie).toContain('token=;');
  });
});