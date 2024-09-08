const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  surveyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WellnessSurvey',
    required: true,
  },
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
      questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'WellnessSurvey.surveyQuestions',
        required: true,
      },
      response: { type: mongoose.Schema.Types.Mixed, required: true },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const WellnessFeedback = mongoose.model('WellnessFeedback', feedbackSchema);

module.exports = WellnessFeedback;
