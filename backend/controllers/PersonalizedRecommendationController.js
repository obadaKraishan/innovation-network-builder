const PersonalizedRecommendation = require('../models/PersonalizedRecommendationModel');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel'); // Assuming you have a UserModel for referencing the user

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

// Get recommendations for a specific user (include employee details)
const getUserRecommendations = asyncHandler(async (req, res) => {
    const recommendations = await PersonalizedRecommendation.find({ employeeId: req.params.userId })
      .populate('employeeId', 'name email') // Ensure employee details are populated
      .exec();
    res.status(200).json(recommendations);
  });  

module.exports = { createRecommendation, getUserRecommendations };
