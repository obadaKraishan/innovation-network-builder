const WellnessResource = require('../models/WellnessResourceModel');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const Notification = require('../models/notificationModel');
const { sendNotification } = require('../services/notificationService');

// Utility function to send notifications to users
const sendResourceNotifications = async (users, message, link, senderId) => {
  try {
    for (const user of users) {
      const newNotification = new Notification({
        recipient: user,
        sender: senderId,
        message,
        type: 'info',
        link,
      });
      await newNotification.save();
      sendNotification(user, newNotification); // Send real-time notification
    }
  } catch (error) {
    console.error('Error sending notifications:', error.message);
  }
};

// Create a wellness resource
const createResource = asyncHandler(async (req, res) => {
  const { resourceTitle, resourceCategory, resourceURL } = req.body;

  const newResource = await WellnessResource.create({
    resourceTitle,
    resourceCategory,
    resourceURL,
    createdBy: req.user._id, // Created by the current user
    createdAt: Date.now(), // Ensure the date is set correctly
  });

  console.log("Resource Created:", newResource);

  // Notify all users about the new wellness resource
  const notificationMessage = `A new wellness resource titled "${resourceTitle}" has been added.`;
  const allUsers = await User.find().select('_id'); // Fetch all users
  const userIds = allUsers.map(user => user._id); // Map to user IDs
  await sendResourceNotifications(userIds, notificationMessage, `/resources/${newResource._id}`, req.user._id);

  res.status(201).json(newResource);
});

// Get all resources (with user details)
const getAllResources = asyncHandler(async (req, res) => {
  try {
    const resources = await WellnessResource.find({}) // Use the correct model
      .populate("createdBy", "name email") // Populate user info
      .exec();

    console.log("Resources fetched:", resources);
    res.status(200).json(resources);
  } catch (error) {
    console.error("Error fetching resources:", error);
    res.status(500).json({ message: 'Error fetching resources' });
  }
});

const getWellnessResourceById = asyncHandler(async (req, res) => {
    console.log("Fetching resource with ID:", req.params.resourceId); // Add this log
    const resource = await WellnessResource.findById(req.params.resourceId);
    if (!resource) {
      res.status(404);
      throw new Error('Resource not found');
    }
    res.status(200).json(resource);
});

// Delete a resource by ID
const deleteResource = asyncHandler(async (req, res) => {
  const resource = await WellnessResource.findById(req.params.resourceId);

  if (!resource) {
    console.error("Resource not found for deletion");
    res.status(404);
    throw new Error('Resource not found');
  }

  await WellnessResource.deleteOne({ _id: req.params.resourceId });

  // Notify users about the deleted resource
  const notificationMessage = `The wellness resource titled "${resource.resourceTitle}" has been removed.`;
  const allUsers = await User.find().select('_id'); // Fetch all users
  const userIds = allUsers.map(user => user._id);
  await sendResourceNotifications(userIds, notificationMessage, '/resources', req.user._id);

  res.status(200).json({ message: 'Resource deleted' });
});


module.exports = { 
    createResource, 
    getAllResources,
    getWellnessResourceById, 
    deleteResource 
};
