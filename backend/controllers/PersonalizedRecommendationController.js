const asyncHandler = require("express-async-handler");
const PersonalizedRecommendation = require("../models/PersonalizedRecommendationModel");
const Notification = require('../models/notificationModel');
const { sendNotification } = require('../services/notificationService');
const Connection = require('../models/connectionModel');


// Utility function to create a new connection between two users
const createConnection = async (userA, userB, context) => {
  try {
    console.log(`Attempting to create connection between ${userA} and ${userB} with context: ${context}`);

    const newConnection = new Connection({
      userA,
      userB,
      context,
      interactionCount: 1,
      lastInteractedAt: Date.now(),
    });

    const savedConnection = await newConnection.save();
    console.log(`Connection successfully created:`, savedConnection);

    return savedConnection;
  } catch (error) {
    console.error(`Error creating connection between ${userA} and ${userB} for context: ${context}:`, error.message);
  }
};

// Utility function to send notifications to users
const sendRecommendationNotifications = async (users, message, link, senderId) => {
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
      sendNotification(user, newNotification);  // Send real-time notification
    }
  } catch (error) {
    console.error('Error sending notifications:', error.message);
  }
};

// Create a personalized recommendation
const createRecommendation = asyncHandler(async (req, res) => {
  console.log("Creating recommendation with body:", req.body);

  const { employeeId, title, recommendationText, resourceUrl } = req.body;

  if (!employeeId || !title || !recommendationText) {
    res.status(400);
    throw new Error("Employee, Title, and Recommendation Text are required");
  }

  const newRecommendation = await PersonalizedRecommendation.create({
    employeeId,
    title,
    recommendationText,
    resourceUrl,
  });

  console.log("Recommendation created:", newRecommendation);

  // Create a connection between the sender and the employee receiving the recommendation
  await createConnection(req.user._id, employeeId, 'personalized recommendation');

  // Send a notification to the employee
  const notificationMessage = `You have received a new personalized recommendation: ${title}`;
  await sendRecommendationNotifications([employeeId], notificationMessage, `/recommendations/${newRecommendation._id}`, req.user._id);

  res.status(201).json(newRecommendation);
});

// Get a single recommendation by ID
const getRecommendationById = asyncHandler(async (req, res) => {
  console.log("Fetching recommendation with ID:", req.params.recommendationId);

  // Use `findById` to ensure only one object is fetched.
  const recommendation = await PersonalizedRecommendation.findById(req.params.recommendationId);

  // If recommendation is not found, return a 404 error
  if (!recommendation) {
    console.log("Recommendation not found for ID:", req.params.recommendationId);
    return res.status(404).json({ message: "Recommendation not found" });
  }

  console.log("Single recommendation fetched:", recommendation);
  res.status(200).json(recommendation);  // Return the single recommendation object
});

// Get recommendations for a specific user or all recommendations if role is CEO/Manager
const getUserRecommendations = asyncHandler(async (req, res) => {
  console.log("Fetching recommendations for user:", req.user);

  const role = req.user.role;
  const query = ["CEO", "Manager"].includes(role)
    ? {}
    : { employeeId: req.params.userId };

  const recommendations = await PersonalizedRecommendation.find(query).populate(
    "employeeId",
    "name email"
  );

  console.log("Recommendations fetched:", recommendations);
  res.status(200).json(recommendations);
});

// Update a recommendation
const updateRecommendation = asyncHandler(async (req, res) => {
  console.log("Updating recommendation with ID:", req.params.recommendationId);

  const recommendation = await PersonalizedRecommendation.findById(req.params.recommendationId);

  if (!recommendation) {
    console.log("Recommendation not found for update");
    res.status(404);
    throw new Error("Recommendation not found");
  }

  recommendation.title = req.body.title || recommendation.title;
  recommendation.recommendationText =
    req.body.recommendationText || recommendation.recommendationText;
  recommendation.resourceUrl =
    req.body.resourceUrl || recommendation.resourceUrl;

  const updatedRecommendation = await recommendation.save();
  console.log("Recommendation updated:", updatedRecommendation);

  // Send a notification to the employee about the update
  const notificationMessage = `Your personalized recommendation: ${updatedRecommendation.title} has been updated.`;
  await sendRecommendationNotifications([updatedRecommendation.employeeId], notificationMessage, `/recommendations/${updatedRecommendation._id}`, req.user._id);

  res.status(200).json(updatedRecommendation);
});

// Delete a recommendation
const deleteRecommendation = asyncHandler(async (req, res) => {
  console.log("Deleting recommendation with ID:", req.params.recommendationId);

  const recommendation = await PersonalizedRecommendation.findByIdAndDelete(req.params.recommendationId);

  if (!recommendation) {
    console.log("Recommendation not found for deletion");
    res.status(404);
    throw new Error("Recommendation not found");
  }

  console.log("Recommendation deleted successfully");

  // Send a notification to the employee about the deletion
  const notificationMessage = `Your personalized recommendation titled: "${recommendation.title}" has been deleted.`;
  await sendRecommendationNotifications([recommendation.employeeId], notificationMessage, `/recommendations`, req.user._id);

  res.status(200).json({ message: "Recommendation removed" });
});


module.exports = {
  createRecommendation,
  getUserRecommendations,
  getRecommendationById,
  updateRecommendation,
  deleteRecommendation,
};
