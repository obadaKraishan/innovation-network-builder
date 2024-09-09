const asyncHandler = require("express-async-handler");
const PersonalizedRecommendation = require("../models/PersonalizedRecommendationModel");

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
  res.status(200).json(updatedRecommendation);
});

module.exports = {
  createRecommendation,
  getUserRecommendations,
  getRecommendationById,
  updateRecommendation,
};
