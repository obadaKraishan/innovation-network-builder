const PersonalizedRecommendation = require('../models/PersonalizedRecommendationModel');
const asyncHandler = require('express-async-handler');

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
  const recommendations = await PersonalizedRecommendation.find({ employeeId: req.params.userId });
  res.status(200).json(recommendations);
});

module.exports = { createRecommendation, getUserRecommendations };
