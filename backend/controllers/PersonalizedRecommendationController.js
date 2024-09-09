const PersonalizedRecommendation = require('../models/PersonalizedRecommendationModel');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

// Create a personalized recommendation
const createRecommendation = asyncHandler(async (req, res) => {
  const { employeeId, recommendationText, resourceUrl } = req.body;
  const newRecommendation = await PersonalizedRecommendation.create({
    employeeId,
    recommendationText,
    resourceUrl,
  });
  res.status(201).json(newRecommendation);
});

// Get recommendations for a specific user
const getUserRecommendations = asyncHandler(async (req, res) => {
  const recommendations = await PersonalizedRecommendation.find({ employeeId: req.params.userId })
    .populate('employeeId', 'name email');
  res.status(200).json(recommendations);
});

// Update a recommendation
const updateRecommendation = asyncHandler(async (req, res) => {
  const recommendation = await PersonalizedRecommendation.findById(req.params.recommendationId);

  if (!recommendation) {
    res.status(404);
    throw new Error("Recommendation not found");
  }

  recommendation.recommendationText = req.body.recommendationText || recommendation.recommendationText;
  recommendation.resourceUrl = req.body.resourceUrl || recommendation.resourceUrl;

  const updatedRecommendation = await recommendation.save();
  res.status(200).json(updatedRecommendation);
});

module.exports = {
  createRecommendation,
  getUserRecommendations,
  updateRecommendation,
};
