// File: backend/routes/messagesRoutes.js

const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  sendMessage,
  getInboxMessages,
  getSentMessages,
  markMessageAsImportant,
  getImportantMessages,
  getMessageDetails,
  replyToMessage,
} = require('../controllers/messagesController');

const router = express.Router();

// Route to send a message
router.post('/', protect, sendMessage);

// Route to get inbox messages
router.get('/inbox', protect, getInboxMessages);

// Route to get sent messages
router.get('/sent', protect, getSentMessages);

// Route to get important messages
router.get('/important', protect, getImportantMessages);

// Route to mark a message as important
router.put('/:id/important', protect, markMessageAsImportant);

// Route to get message details
router.get('/:id', protect, getMessageDetails);

// Route to reply to a message
router.post('/:id/reply', protect, replyToMessage);

module.exports = router;
