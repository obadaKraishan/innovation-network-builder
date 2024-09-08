const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const WellnessSurvey = require('../models/WellnessModel');
const WellnessFeedback = require('../models/WellnessFeedbackModel');

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
  
    console.log('Submitting feedback: ', { surveyId, feedback, anonymous }); // Debugging log
  
    const survey = await WellnessSurvey.findById(surveyId);
  
    if (!survey) {
      console.error('Survey not found with ID:', surveyId); // Error log
      res.status(404);
      throw new Error('Survey not found');
    }
  
    const feedbackData = {
      surveyId,
      employeeId: anonymous ? null : req.user._id,
      feedback: feedback.map((fb) => ({
        ...fb,
        _id: new mongoose.Types.ObjectId(), // Ensure each feedback item has a unique _id
      })),
      anonymous,
    };
  
    console.log('Adding feedback to new WellnessFeedback collection:', feedbackData); // Debugging log
    const newFeedback = await WellnessFeedback.create(feedbackData);
  
    console.log('Feedback submitted successfully'); // Success log
    res.status(201).json({ message: 'Feedback submitted successfully', feedbackId: newFeedback._id });
  });

// Fetch feedback details by feedbackId
const getFeedbackById = asyncHandler(async (req, res) => {
    const feedbackId = req.params.feedbackId;
  
    console.log('Fetching feedback with ID:', feedbackId); // Debugging log
  
    // Validate if feedbackId is provided and valid
    if (!mongoose.Types.ObjectId.isValid(feedbackId)) {
      console.error('Invalid feedback ID:', feedbackId); // Error log
      return res.status(400).json({ message: 'Invalid feedback ID' });
    }
  
    const feedback = await WellnessSurvey.findOne({ 'feedback._id': feedbackId })
      .populate('feedback.employeeId', 'name role') // Ensure employee name is populated
      .select('feedback surveyQuestions createdAt title');
  
    if (!feedback) {
      console.error('Feedback not found with ID:', feedbackId); // Error log
      res.status(404);
      throw new Error('Feedback not found');
    }
  
    const feedbackItem = feedback.feedback.find((fb) => fb._id.toString() === feedbackId);
  
    if (!feedbackItem) {
      console.error('Feedback item not found in survey:', feedbackId); // Error log
      return res.status(404).json({ message: 'Feedback not found' });
    }
  
    console.log('Found feedback item:', feedbackItem); // Debugging log
    res.status(200).json({
      feedback: feedbackItem.feedback,
      surveyQuestions: feedback.surveyQuestions,
      employeeId: feedbackItem.employeeId,
      anonymous: feedbackItem.anonymous,
      createdAt: feedbackItem.createdAt,
    });
  });

// Fetch all non-anonymous feedback for management
const getNonAnonymousFeedback = asyncHandler(async (req, res) => {
    try {
      const feedbacks = await WellnessFeedback.find({ anonymous: false })
        .populate('employeeId', 'name')
        .populate('surveyId', 'title');
  
      if (!feedbacks.length) {
        return res.status(404).json({ message: 'No non-anonymous feedback found' });
      }
  
      res.status(200).json(feedbacks);
    } catch (error) {
      console.error('Error fetching non-anonymous feedback:', error);
      res.status(500).json({ message: 'Failed to fetch non-anonymous feedback' });
    }
  });
  
  // Get anonymous feedback for management
  const getAnonymousFeedback = asyncHandler(async (req, res) => {
    try {
      const feedbacks = await WellnessFeedback.find({ anonymous: true })
        .populate('surveyId', 'title');
  
      if (!feedbacks.length) {
        return res.status(404).json({ message: 'No anonymous feedback found' });
      }
  
      res.status(200).json(feedbacks);
    } catch (error) {
      console.error('Error fetching anonymous feedback:', error);
      res.status(500).json({ message: 'Failed to fetch anonymous feedback' });
    }
  });

// Fetch feedback for a specific user
const getUserFeedback = asyncHandler(async (req, res) => {
    const userId = req.params.userId;
  
    console.log('Fetching user feedback for user:', userId); // Debugging log
  
    // Fetch feedback from the new WellnessFeedback collection
    const feedbacks = await WellnessFeedback.find({ employeeId: userId })
      .populate('surveyId', 'title') // Populate survey details
      .select('feedback surveyId createdAt anonymous');
  
    console.log('User feedback fetched:', feedbacks); // Debugging log
  
    if (!feedbacks.length) {
      return res.status(404).json({ message: 'No feedback found for this user' });
    }
  
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
  getFeedbackById,
  getAnonymousFeedback,
  getNonAnonymousFeedback,
  getUserFeedback,
  getWellnessResources,
  getDashboardMetrics,
};
