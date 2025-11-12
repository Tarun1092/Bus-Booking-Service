const express = require('express');
const { searchBuses, getBusById, getAllBuses } = require('../controllers/busController');
const router = express.Router();

router.get('/search', searchBuses);
router.get('/', getAllBuses);
router.get('/:id', getBusById);

module.exports = router;