const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { getDepartments } = require('../controllers/departmentController');

const router = express.Router();

// Use the protect middleware for routes that require authentication
router.route('/').get(protect, getDepartments);

module.exports = router;
