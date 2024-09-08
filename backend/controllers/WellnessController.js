const asyncHandler = require('express-async-handler');
const WellnessSurvey = require('../models/WellnessModel');

// Create a wellness survey
const createSurvey = asyncHandler(async (req, res) => {
  const { title, questions, isAnonymous } = req.body;

  const newSurvey = await WellnessSurvey.create({
    createdBy: req.user._id,
    title,
    surveyQuestions: questions, // Advanced questions with types and options
    isAnonymous,
  });

  res.status(201).json(newSurvey);
});

// Submit feedback for a wellness survey
const submitFeedback = asyncHandler(async (req, res) => {
  const { surveyId, feedback, anonymous } = req.body;

  const survey = await WellnessSurvey.findById(surveyId);

  if (!survey) {
    res.status(404);
    throw new Error('Survey not found');
  }

  const feedbackData = {
    employeeId: anonymous ? null : req.user._id,
    feedback,
    anonymous,
  };

  survey.feedback.push(feedbackData);
  await survey.save();

  res.status(201).json({ message: 'Feedback submitted successfully' });
});

// Get anonymous feedback for management
const getAnonymousFeedback = asyncHandler(async (req, res) => {
  const feedbacks = await WellnessSurvey.find({ 'feedback.anonymous': true })
    .select('feedback')
    .populate('feedback.employeeId', 'name role');

  res.status(200).json(feedbacks);
});

// Fetch wellness resources for employees
const getWellnessResources = asyncHandler(async (req, res) => {
  const resources = await WellnessSurvey.find({}).select('resources');
  res.status(200).json(resources);
});

// Get wellness dashboard metrics for management
const getDashboardMetrics = asyncHandler(async (req, res) => {
  const metrics = await WellnessSurvey.aggregate([
    { $unwind: '$feedback' },
    {
      $group: {
        _id: null,
        avgStressLevel: { $avg: '$feedback.feedback.stressLevel' },
        avgJobSatisfaction: { $avg: '$feedback.feedback.jobSatisfaction' },
      },
    },
  ]);

  res.status(200).json(metrics);
});

module.exports = {
  createSurvey,
  submitFeedback,
  getAnonymousFeedback,
  getWellnessResources,
  getDashboardMetrics,
};
