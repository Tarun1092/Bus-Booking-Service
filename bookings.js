const express = require('express');
const { createBooking, getUserBookings, cancelBooking } = require('../controllers/bookingController');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, createBooking);
router.get('/user', auth, getUserBookings);
router.put('/:id/cancel', auth, cancelBooking);

module.exports = router;