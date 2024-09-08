const mongoose = require('mongoose');

const wellnessResourceSchema = new mongoose.Schema({
  resourceTitle: { type: String, required: true },
  resourceCategory: { type: String, required: true },
  resourceURL: { type: String, required: true },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const WellnessResource = mongoose.model('WellnessResource', wellnessResourceSchema);

module.exports = WellnessResource;
