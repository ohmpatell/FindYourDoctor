const express = require('express');
const cors = require('cors');

const connectDB = require('./config/db');


connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to FindYourDoctor Backend Server');
});

const { PORT } = require('./config/config');
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const authRoutes = require('./routes/auth.routes');
const doctorRoutes = require('./routes/doctor.routes'); 
const appointmentRoutes = require('./routes/appointment.routes');
const walkInRoutes = require('./routes/walkin.routes');

app.use('/api/auth', authRoutes);

app.use('/api/doctors', doctorRoutes);
app.use('/api/appointment',appointmentRoutes);
app.use('/api/walk-ins',walkInRoutes);