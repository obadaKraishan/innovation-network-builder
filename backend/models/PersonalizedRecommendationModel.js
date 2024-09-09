const mongoose = require('mongoose');

const personalizedRecommendationSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: { 
    type: String, 
    required: true  
  },
  recommendationText: { 
    type: String, 
    required: true 
  },
  resourceUrl: { 
    type: String  
  }, 
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const PersonalizedRecommendation = mongoose.model('PersonalizedRecommendation', personalizedRecommendationSchema);

module.exports = PersonalizedRecommendation;
