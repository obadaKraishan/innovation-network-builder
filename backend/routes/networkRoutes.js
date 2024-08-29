const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { getDashboardData } = require('../controllers/networkController');

const router = express.Router();

router.route('/dashboard').get(protect, getDashboardData);

module.exports = router;
