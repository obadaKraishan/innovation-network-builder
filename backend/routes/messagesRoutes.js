// File: backend/routes/messagesRoutes.js

const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { sendMessage } = require('../controllers/messagesController');

const router = express.Router();

router.post('/', protect, sendMessage);

// Additional routes for fetching inbox, sent, marking important, etc.

module.exports = router;
