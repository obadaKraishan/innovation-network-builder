const mongoose = require('mongoose');
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

// Fetch all surveys 
const getAllSurveys = asyncHandler(async (req, res) => {
    const surveys = await WellnessSurvey.find({});
    res.status(200).json(surveys);
  });
  
  // Fetch a single survey by ID
const getSurveyById = asyncHandler(async (req, res) => {
    const surveyId = req.params.surveyId;
  
    // Validate if surveyId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(surveyId)) {
      return res.status(400).json({ message: 'Invalid survey ID' });
    }
  
    const survey = await WellnessSurvey.findById(surveyId);
    if (!survey) {
      res.status(404);
      throw new Error('Survey not found');
    }
    res.status(200).json(survey);
  });
  
  // Update a survey
  const updateSurvey = asyncHandler(async (req, res) => {
    const { title, questions, isAnonymous } = req.body;
    const survey = await WellnessSurvey.findById(req.params.surveyId);
  
    if (!survey) {
      res.status(404);
      throw new Error('Survey not found');
    }
  
    survey.title = title || survey.title;
    survey.surveyQuestions = questions || survey.surveyQuestions;
    survey.isAnonymous = isAnonymous !== undefined ? isAnonymous : survey.isAnonymous;
  
    await survey.save();
    res.status(200).json(survey);
  });
  
  // Delete a survey
  const deleteSurvey = asyncHandler(async (req, res) => {
    const survey = await WellnessSurvey.findById(req.params.surveyId);
  
    if (!survey) {
      res.status(404);
      throw new Error('Survey not found');
    }
  
    await survey.remove();
    res.status(200).json({ message: 'Survey deleted' });
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

// Fetch feedback for a specific user
const getUserFeedback = asyncHandler(async (req, res) => {
    const userId = req.params.userId;
    const feedbacks = await WellnessSurvey.find({ 'feedback.employeeId': userId })
        .select('feedback')
        .populate('feedback.employeeId', 'name role');

    res.status(200).json(feedbacks);
});
  
// Fetch all non-anonymous feedback for management
const getNonAnonymousFeedback = asyncHandler(async (req, res) => {
    const feedbacks = await WellnessSurvey.find({ 'feedback.anonymous': false })
       .select('feedback')
       .populate('feedback.employeeId', 'name role');
    console.log("Non-anonymous feedback:", feedbacks);
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
  getAllSurveys, 
  getSurveyById, 
  updateSurvey, 
  deleteSurvey,
  submitFeedback,
  getAnonymousFeedback,
  getNonAnonymousFeedback,
  getUserFeedback,
  getWellnessResources,
  getDashboardMetrics,
};
