const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const WellnessSurvey = require('../models/WellnessModel');
const WellnessFeedback = require('../models/WellnessFeedbackModel');
const Notification = require('../models/notificationModel');
const { sendNotification } = require('../services/notificationService');
const Connection = require('../models/connectionModel');


// Utility function to create a new connection between two users
const createConnection = async (userA, userB, context) => {
  try {
    console.log(`Attempting to create connection between ${userA} and ${userB} with context: ${context}`);

    const newConnection = new Connection({
      userA,
      userB,
      context,
      interactionCount: 1,
      lastInteractedAt: Date.now(),
    });

    const savedConnection = await newConnection.save();
    console.log(`Connection successfully created:`, savedConnection);

    return savedConnection;
  } catch (error) {
    console.error(`Error creating connection between ${userA} and ${userB} for context: ${context}:`, error.message);
  }
};

// Utility function to send notifications to users
const sendWellnessNotifications = async (users, message, link, senderId) => {
  try {
    for (const user of users) {
      const newNotification = new Notification({
        recipient: user,
        sender: senderId,
        message,
        type: 'info',
        link,
      });
      await newNotification.save();
      sendNotification(user, newNotification);  // Send real-time notification
    }
  } catch (error) {
    console.error('Error sending notifications:', error.message);
  }
};

// Create a wellness survey
const createSurvey = asyncHandler(async (req, res) => {
  const { title, questions, isAnonymous } = req.body;

  const newSurvey = await WellnessSurvey.create({
    createdBy: req.user._id,
    title,
    surveyQuestions: questions, // Advanced questions with types and options
    isAnonymous,
  });

  // Notify all employees about the new survey
  const notificationMessage = `A new wellness survey "${title}" has been created. Please participate.`;
  await sendWellnessNotifications([req.user._id], notificationMessage, `/surveys/${newSurvey._id}`, req.user._id);

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

  const updatedSurvey = await survey.save();

  // Notify employees about the survey update
  const notificationMessage = `The wellness survey "${updatedSurvey.title}" has been updated.`;
  await sendWellnessNotifications([req.user._id], notificationMessage, `/surveys/${updatedSurvey._id}`, req.user._id);

  res.status(200).json(updatedSurvey);
});
  
// Delete a survey
const deleteSurvey = asyncHandler(async (req, res) => {
  const survey = await WellnessSurvey.findById(req.params.surveyId);

  if (!survey) {
    res.status(404);
    throw new Error('Survey not found');
  }

  await survey.remove();

  // Notify employees about the deleted survey
  const notificationMessage = `The wellness survey "${survey.title}" has been deleted.`;
  await sendWellnessNotifications([req.user._id], notificationMessage, `/surveys`, req.user._id);

  res.status(200).json({ message: 'Survey deleted' });
});

  // Submit feedback for a wellness survey
  const submitFeedback = asyncHandler(async (req, res) => {
    const { surveyId, feedback, anonymous } = req.body;
  
    console.log('Submitting feedback: ', { surveyId, feedback, anonymous });
  
    const survey = await WellnessSurvey.findById(surveyId);
  
    if (!survey) {
      console.error('Survey not found with ID:', surveyId);
        res.status(404);
        throw new Error('Survey not found');
    }
  
    const feedbackData = {
      surveyId,
      employeeId: anonymous ? null : req.user._id, // Set employeeId as null if anonymous
      feedback: feedback.map((fb) => ({
        ...fb,
        _id: new mongoose.Types.ObjectId(), // Ensure each feedback item has a unique _id
      })),
      anonymous,
    };
  
    console.log('Adding feedback to new WellnessFeedback collection:', feedbackData);
    const newFeedback = await WellnessFeedback.create(feedbackData);
  
    // Notify the creator of the survey about the new feedback
    const notificationMessage = `New feedback has been submitted for the wellness survey "${survey.title}".`;
    await sendWellnessNotifications([survey.createdBy], notificationMessage, `/feedback/${newFeedback._id}`, req.user._id);
  
    console.log('Feedback submitted successfully');
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

    const feedback = await WellnessFeedback.findById(feedbackId)
      .populate('employeeId', 'name role') // Ensure employee name is populated
      .populate('surveyId', 'title surveyQuestions') // Populate survey details
      .select('feedback createdAt anonymous employeeId');

    if (!feedback) {
      console.error('Feedback not found with ID:', feedbackId); // Error log
      res.status(404);
      throw new Error('Feedback not found');
    }

    res.status(200).json(feedback);
});

// Fetch all non-anonymous feedback for management
const getNonAnonymousFeedback = asyncHandler(async (req, res) => {
    try {
      const feedbacks = await WellnessFeedback.find({ anonymous: false })
        .populate("employeeId", "name _id") // Populate employee name and _id
        .populate("surveyId", "title"); // Populate survey title
  
      if (!feedbacks.length) {
        return res.status(404).json({ message: "No non-anonymous feedback found" });
      }
  
      res.status(200).json(feedbacks);
    } catch (error) {
      console.error("Error fetching non-anonymous feedback:", error);
      res.status(500).json({ message: "Failed to fetch non-anonymous feedback" });
    }
  });
  
// Get anonymous feedback for management
const getAnonymousFeedback = asyncHandler(async (req, res) => {
    try {
      const feedbacks = await WellnessFeedback.find({ anonymous: true })
        .populate("surveyId", "title");
  
      if (!feedbacks.length) {
        return res.status(404).json({ message: "No anonymous feedback found" });
      }
  
      res.status(200).json(feedbacks);
    } catch (error) {
      console.error("Error fetching anonymous feedback:", error);
      res.status(500).json({ message: "Failed to fetch anonymous feedback" });
    }
  });

// Fetch feedback for a specific user
const getUserFeedback = asyncHandler(async (req, res) => {
    const userId = req.params.userId;
  
    try {
      const feedbacks = await WellnessFeedback.find({
        $or: [
          { employeeId: userId }, // Feedback explicitly belonging to the user
          { employeeId: null, anonymous: true }, // Anonymous feedback
        ],
      })
        .populate("employeeId", "name _id") // Populate employee name and _id
        .populate("surveyId", "title"); // Populate survey title
  
      if (!feedbacks.length) {
        return res.status(200).json({ message: "No feedback found for this user", feedbacks: [] });
      }
  
      res.status(200).json(feedbacks);
    } catch (error) {
      console.error("Error fetching user feedback:", error);
      res.status(500).json({ message: "Failed to fetch user feedback" });
    }
  });

// Fetch wellness resources for employees
const getWellnessResources = asyncHandler(async (req, res) => {
    try {
      const resources = await WellnessResource.find({});
      res.status(200).json(resources);
    } catch (error) {
      console.error('Error fetching resources:', error);
      res.status(500).json({ message: 'Error fetching resources' });
    }
  });  

// Get wellness dashboard metrics for management
const getDashboardMetrics = asyncHandler(async (req, res) => {
  const metrics = await WellnessFeedback.aggregate([
    { $unwind: '$feedback' },
    {
      $group: {
        _id: null,
        avgStressLevel: { $avg: { $cond: [{ $eq: ['$feedback.questionId', 'STRESS_LEVEL_QUESTION_ID'] }, '$feedback.response', null] }},
        avgJobSatisfaction: { $avg: { $cond: [{ $eq: ['$feedback.questionId', 'JOB_SATISFACTION_QUESTION_ID'] }, '$feedback.response', null] }},
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
