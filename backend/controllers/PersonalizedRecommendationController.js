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

  console.log("Recommendation Created:", newRecommendation);
  res.status(201).json(newRecommendation);
});

// Get recommendations for a specific user (include employee details)
const getUserRecommendations = asyncHandler(async (req, res) => {
  try {
    const recommendations = await PersonalizedRecommendation.find({ employeeId: req.params.userId })
      .populate('employeeId', 'name email') // Ensure employee details are populated
      .exec();

    // Log recommendation data for debugging
    console.log("Recommendations for User ID:", req.params.userId, recommendations);

    if (!recommendations || recommendations.length === 0) {
      console.log("No recommendations found");
    }

    res.status(200).json(recommendations);
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    res.status(500).json({ message: 'Error fetching recommendations' });
  }
});

module.exports = { createRecommendation, getUserRecommendations };
