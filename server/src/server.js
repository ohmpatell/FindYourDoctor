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

// Import routes
const authRoutes = require('./routes/auth.routes');
const doctorRoutes = require('./routes/doctor.routes'); // Import the new doctor routes

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
