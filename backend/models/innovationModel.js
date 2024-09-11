const mongoose = require('mongoose');

const innovationSchema = new mongoose.Schema({
  ideaId: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
  },
  resources: {
    budget: {
      type: Number,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    manpower: {
      type: Number,
      required: true,
    },
    toolsAndInfrastructure: {
      type: String,
      required: true,
    },
  },
  stage: {
    type: String,
    enum: ['submission', 'review', 'development', 'implementation'],
    default: 'submission',
  },
  impactScore: {
    type: Number,
    default: 0,
  },
  feasibilityScore: {
    type: Number,
    default: 0,
  },
  costScore: {
    type: Number,
    default: 0,
  },
  alignmentScore: {
    type: Number,
    default: 0,
  },
  priority: {
    type: Number,
    default: 0,  // Calculated based on other scores
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  approvedAt: {
    type: Date,
  },
  implementedAt: {
    type: Date,
  },
});

const Innovation = mongoose.model('Innovation', innovationSchema);

module.exports = Innovation;
