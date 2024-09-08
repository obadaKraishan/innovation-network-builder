const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  label: { type: String, required: true }, // The text of the question
  type: { 
    type: String, 
    enum: ['text', 'radio', 'checkbox', 'select', 'date'], 
    required: true 
  }, // Question type
  options: [String], // Options for radio, checkbox, and select types
});

const feedbackSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null, // Null if feedback is anonymous
  },
  anonymous: {
    type: Boolean,
    default: false,
  },
  feedback: [
    {
      jobSatisfaction: { type: Number, required: true },
      stressLevel: { type: Number, required: true },
      otherComments: { type: String },
    },
  ],
  recommendations: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const wellnessSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Survey title
  surveyQuestions: [questionSchema], // Array of advanced questions
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  feedback: [feedbackSchema], // Array of feedback responses
  isAnonymous: {
    type: Boolean,
    default: false,
  },
  resources: [
    {
      resourceTitle: { type: String, required: true },
      resourceCategory: { type: String, required: true },
      resourceURL: { type: String, required: true },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const WellnessSurvey = mongoose.model('WellnessSurvey', wellnessSchema);

module.exports = WellnessSurvey;
