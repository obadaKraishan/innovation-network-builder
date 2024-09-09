const asyncHandler = require("express-async-handler");
const PersonalizedRecommendation = require("../models/PersonalizedRecommendationModel");

// Create a personalized recommendation
const createRecommendation = asyncHandler(async (req, res) => {
  const { employeeId, title, recommendationText, resourceUrl } = req.body;

  if (!title || !recommendationText) {
    res.status(400);
    throw new Error("Title and Recommendation Text are required");
  }

  const newRecommendation = await PersonalizedRecommendation.create({
    employeeId,
    title,
    recommendationText,
    resourceUrl,
  });

  res.status(201).json(newRecommendation);
});

// Get a single recommendation by ID
const getRecommendationById = asyncHandler(async (req, res) => {
  const recommendation = await PersonalizedRecommendation.findById(req.params.recommendationId);

  if (!recommendation) {
    res.status(404);
    throw new Error("Recommendation not found");
  }

  res.status(200).json(recommendation);  // Ensure this returns a single object, not an array
});

// Get recommendations for a specific user or all recommendations if role is CEO/Manager
const getUserRecommendations = asyncHandler(async (req, res) => {
  const role = req.user.role;
  const query = ["CEO", "Manager"].includes(role)
    ? {}
    : { employeeId: req.params.userId };

  const recommendations = await PersonalizedRecommendation.find(query).populate(
    "employeeId",
    "name email"
  ); // Ensure 'title' is included here

  res.status(200).json(recommendations);
});

// Update a recommendation
const updateRecommendation = asyncHandler(async (req, res) => {
  const recommendation = await PersonalizedRecommendation.findById(
    req.params.recommendationId
  );

  if (!recommendation) {
    res.status(404);
    throw new Error("Recommendation not found");
  }

  recommendation.title = req.body.title || recommendation.title;
  recommendation.recommendationText =
    req.body.recommendationText || recommendation.recommendationText;
  recommendation.resourceUrl =
    req.body.resourceUrl || recommendation.resourceUrl;

  const updatedRecommendation = await recommendation.save();
  res.status(200).json(updatedRecommendation);
});

module.exports = {
  createRecommendation,
  getUserRecommendations,
  getRecommendationById,
  updateRecommendation,
};
