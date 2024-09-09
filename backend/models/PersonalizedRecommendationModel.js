const mongoose = require('mongoose');

const personalizedRecommendationSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: { 
    type: String, 
    required: true  // Make this field required 
  },
  recommendationText: { 
    type: String, 
    required: true 
  },
  resourceUrl: { 
    type: String  // Optional link to related wellness resource
  }, 
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const PersonalizedRecommendation = mongoose.model('PersonalizedRecommendation', personalizedRecommendationSchema);

module.exports = PersonalizedRecommendation;
