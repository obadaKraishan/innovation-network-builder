const express = require('express');
const { 
    createNotification, 
    getUserNotifications, 
    getNotificationById,
    markAsRead, 
    markAllAsRead 
} = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Routes for notifications
router.route('/').post(protect, createNotification).get(protect, getUserNotifications);
router.route('/:id/read').put(protect, markAsRead);
router.route('/read-all').put(protect, markAllAsRead);
router.route('/:id').get(protect, getNotificationById);

module.exports = router;
