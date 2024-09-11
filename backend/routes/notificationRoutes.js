const express = require('express');
const { createNotification, getUserNotifications, markAsRead, markAllAsRead } = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Routes for notifications
router.route('/').post(protect, createNotification).get(protect, getUserNotifications);
router.route('/:id/read').put(protect, markAsRead);
router.route('/read-all').put(protect, markAllAsRead);

module.exports = router;
