// File: backend/controllers/notificationController.js

const asyncHandler = require('express-async-handler');
const Notification = require('../models/notificationModel');
const { sendNotification } = require('../services/notificationService');  // Import from the service

// @desc    Create a notification
// @route   POST /api/notifications
// @access  Private
const createNotification = asyncHandler(async (req, res) => {
  const { recipient, message, type, link } = req.body;

  const notification = new Notification({
    recipient,
    sender: req.user._id,
    message,
    type,
    link,
  });

  const createdNotification = await notification.save();

  // Emit the notification to the recipient in real-time using Socket.IO
  sendNotification(recipient, createdNotification);

  res.status(201).json(createdNotification);
});

// @desc    Get all notifications for a user
// @route   GET /api/notifications
// @access  Private
const getUserNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ recipient: req.user._id })
    .sort({ createdAt: -1 })
    .limit(20);
  res.json(notifications);
});

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (notification) {
    notification.read = true;
    await notification.save();
    res.json({ message: 'Notification marked as read' });
  } else {
    res.status(404);
    throw new Error('Notification not found');
  }
});

// @desc    Get notification details by ID
// @route   GET /api/notifications/:id
// @access  Private
const getNotificationById = asyncHandler(async (req, res) => {
    const notification = await Notification.findById(req.params.id);
  
    if (!notification) {
      res.status(404);
      throw new Error('Notification not found');
    }
  
    res.json(notification);
  });

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ recipient: req.user._id, read: false }, { read: true });
  res.json({ message: 'All notifications marked as read' });
});

module.exports = { 
    createNotification, 
    getUserNotifications, 
    getNotificationById,
    markAsRead, 
    markAllAsRead 
};
