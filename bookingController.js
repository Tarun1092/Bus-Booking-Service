const db = require('../config/database');

const createBooking = async (req, res) => {
    const { busId, seatNumbers, totalSeats, totalAmount, journeyDate } = req.body;
    const userId = req.user.userId;

    try {
        // Check bus availability
        const [buses] = await db.promise().execute(
            'SELECT * FROM buses WHERE id = ? AND available_seats >= ?',
            [busId, totalSeats]
        );

        if (buses.length === 0) {
            return res.status(400).json({ message: 'Not enough seats available' });
        }

        // Generate PNR number
        const pnrNumber = 'PNR' + Date.now();

        const [result] = await db.promise().execute(
            `INSERT INTO bookings (user_id, bus_id, seat_numbers, total_seats, total_amount, journey_date, pnr_number) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [userId, busId, seatNumbers.join(','), totalSeats, totalAmount, journeyDate, pnrNumber]
        );

        // Update available seats
        await db.promise().execute(
            'UPDATE buses SET available_seats = available_seats - ? WHERE id = ?',
            [totalSeats, busId]
        );

        // Get booking details with bus info
        const [bookings] = await db.promise().execute(
            `SELECT b.*, bus.bus_name, bus.source_city, bus.destination_city, bus.departure_time 
       FROM bookings b 
       JOIN buses bus ON b.bus_id = bus.id 
       WHERE b.id = ?`,
            [result.insertId]
        );

        res.status(201).json({
            message: 'Booking created successfully',
            booking: bookings[0]
        });
    } catch (error) {
        console.error('Create booking error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getUserBookings = async (req, res) => {
    const userId = req.user.userId;

    try {
        const [bookings] = await db.promise().execute(
            `SELECT b.*, bus.bus_name, bus.source_city, bus.destination_city, bus.departure_time 
       FROM bookings b 
       JOIN buses bus ON b.bus_id = bus.id 
       WHERE b.user_id = ? 
       ORDER BY b.booking_date DESC`,
            [userId]
        );

        res.json(bookings);
    } catch (error) {
        console.error('Get user bookings error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const cancelBooking = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;

    try {
        // Get booking details
        const [bookings] = await db.promise().execute(
            'SELECT * FROM bookings WHERE id = ? AND user_id = ?',
            [id, userId]
        );

        if (bookings.length === 0) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        const booking = bookings[0];

        if (booking.status === 'cancelled') {
            return res.status(400).json({ message: 'Booking already cancelled' });
        }

        // Cancel booking
        await db.promise().execute(
            'UPDATE bookings SET status = "cancelled" WHERE id = ?',
            [id]
        );

        // Restore available seats
        await db.promise().execute(
            'UPDATE buses SET available_seats = available_seats + ? WHERE id = ?',
            [booking.total_seats, booking.bus_id]
        );

        res.json({ message: 'Booking cancelled successfully' });
    } catch (error) {
        console.error('Cancel booking error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { createBooking, getUserBookings, cancelBooking };