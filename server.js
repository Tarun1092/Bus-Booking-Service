const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/buses', require('./routes/buses'));
app.use('/api/bookings', require('./routes/bookings'));

// Default route
app.get('/', (req, res) => {
    res.json({ message: 'Bus Booking System API' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});