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

const wellnessSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Survey title
  surveyQuestions: [questionSchema], // Array of advanced questions
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
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
