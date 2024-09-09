const asyncHandler = require("express-async-handler");
const PersonalizedRecommendation = require("../models/PersonalizedRecommendationModel");

// Create a personalized recommendation
const createRecommendation = asyncHandler(async (req, res) => {
  console.log("Creating recommendation with body:", req.body); // Log the request body

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

  console.log("Recommendation created:", newRecommendation); // Log the newly created recommendation
  res.status(201).json(newRecommendation);
});

// Get a single recommendation by ID
const getRecommendationById = asyncHandler(async (req, res) => {
  console.log("Fetching recommendation with ID:", req.params.recommendationId); // Log the recommendationId

  const recommendation = await PersonalizedRecommendation.findById(req.params.recommendationId);

  if (!recommendation) {
    console.log("Recommendation not found"); // Log if recommendation is not found
    res.status(404);
    throw new Error("Recommendation not found");
  }

  console.log("Recommendation fetched:", recommendation); // Log the fetched recommendation
  res.status(200).json(recommendation);
});

// Get recommendations for a specific user or all recommendations if role is CEO/Manager
const getUserRecommendations = asyncHandler(async (req, res) => {
  console.log("Fetching recommendations for user:", req.user); // Log the user details

  const role = req.user.role;
  const query = ["CEO", "Manager"].includes(role)
    ? {}
    : { employeeId: req.params.userId };

  const recommendations = await PersonalizedRecommendation.find(query).populate(
    "employeeId",
    "name email"
  );

  console.log("Recommendations fetched:", recommendations); // Log the fetched recommendations
  res.status(200).json(recommendations);
});

// Update a recommendation
const updateRecommendation = asyncHandler(async (req, res) => {
  console.log("Updating recommendation with ID:", req.params.recommendationId); // Log the recommendation ID

  const recommendation = await PersonalizedRecommendation.findById(req.params.recommendationId);

  if (!recommendation) {
    console.log("Recommendation not found for update"); // Log if not found
    res.status(404);
    throw new Error("Recommendation not found");
  }

  recommendation.title = req.body.title || recommendation.title;
  recommendation.recommendationText =
    req.body.recommendationText || recommendation.recommendationText;
  recommendation.resourceUrl =
    req.body.resourceUrl || recommendation.resourceUrl;

  const updatedRecommendation = await recommendation.save();
  console.log("Recommendation updated:", updatedRecommendation); // Log the updated recommendation
  res.status(200).json(updatedRecommendation);
});

module.exports = {
  createRecommendation,
  getUserRecommendations,
  getRecommendationById,
  updateRecommendation,
};
