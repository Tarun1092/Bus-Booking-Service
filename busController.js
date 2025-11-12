const db = require('../config/database');

const searchBuses = async (req, res) => {
    const { source, destination, date } = req.query;

    try {
        const [buses] = await db.promise().execute(
            `SELECT * FROM buses 
       WHERE source_city = ? AND destination_city = ? 
       AND DATE(departure_time) = ? 
       AND available_seats > 0`,
            [source, destination, date]
        );

        res.json(buses);
    } catch (error) {
        console.error('Search buses error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getBusById = async (req, res) => {
    const { id } = req.params;

    try {
        const [buses] = await db.promise().execute(
            'SELECT * FROM buses WHERE id = ?',
            [id]
        );

        if (buses.length === 0) {
            return res.status(404).json({ message: 'Bus not found' });
        }

        res.json(buses[0]);
    } catch (error) {
        console.error('Get bus error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getAllBuses = async (req, res) => {
    try {
        const [buses] = await db.promise().execute(
            'SELECT * FROM buses WHERE available_seats > 0'
        );

        res.json(buses);
    } catch (error) {
        console.error('Get all buses error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { searchBuses, getBusById, getAllBuses };