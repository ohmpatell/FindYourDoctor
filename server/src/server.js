const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to FindYourDoctor Backend Server');
});


const { PORT } = require('./config/config');
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
