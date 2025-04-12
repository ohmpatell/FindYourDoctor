const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const connectDB = require('./config/db');


connectDB();

const app = express();

const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:4173'],
  credentials: true, 
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Welcome to FindYourDoctor Backend Server');
});

const { PORT } = require('./config/config');
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const authRoutes = require('./routes/auth.routes');
const doctorRoutes = require('./routes/doctor.routes'); 
const appointmentRoutes = require('./routes/appointment.routes');
const walkInRoutes = require('./routes/walkin.routes');
const clinicRoutes = require('./routes/clinic.routes');
const profileRoutes = require('./routes/profile.routes');


app.use('/api/auth', authRoutes);

app.use('/api/doctors', doctorRoutes);
app.use('/api/appointment',appointmentRoutes);
app.use('/api/walk-ins',walkInRoutes);
app.use('/api/clinics',clinicRoutes)
app.use('/api/profile', profileRoutes);
