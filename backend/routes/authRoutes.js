const express = require('express');
const { authUser } = require('../controllers/authController');

const router = express.Router();

// User login route
router.post('/login', authUser);

module.exports = router;
