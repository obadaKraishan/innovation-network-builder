const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { getDashboardData } = require('../controllers/networkController'); // Make sure this path is correct

const router = express.Router();

// Ensure the `getDashboardData` function is correctly defined and imported
router.get('/dashboard', protect, getDashboardData);

module.exports = router;
