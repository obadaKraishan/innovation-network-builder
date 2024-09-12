const mongoose = require('mongoose');

// Feedback schema
const feedbackSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  comment: { type: String, required: true },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Feedback', default: null },
  ideaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Innovation', required: true },
  createdAt: { type: Date, default: Date.now },
});

const feedbackModel = mongoose.model('Feedback', feedbackSchema);

// Innovation schema with voting fields
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
  problem: {
    type: String,
    required: true,
  },
  solution: {
    type: String,
    required: true,
  },
  expectedImpact: {
    type: String,
    required: true,
  },
  impactType: {
    type: String, // Financial, Operational, Customer Satisfaction
    required: true,
  },
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  department: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department', // Updated to an array of ObjectId
  }],
  resources: {
    budgetMin: {
      type: Number,
      required: true,
    },
    budgetMax: {
      type: Number,
      required: true,
    },
    totalTime: {
      type: String,
      required: true,
    },
    deliveryDate: {
      type: String,
      default: null,
    },
    manpower: {
      type: Number,
      required: true,
    },
    fullTimeEmployees: {
      type: Number,
      default: 0,
    },
    contractors: {
      type: Number,
      default: 0,
    },
    toolsAndInfrastructure: {
      type: String,
      required: true,
    },
  },
  roiEstimate: {
    type: Number, // ROI in percentage
    default: null,
  },
  businessGoalAlignment: {
    type: [String], // Array of business goals
  },
  riskAssessment: {
    type: String,
    default: '',
  },
  successMetrics: {
    type: String,
    default: '',
  },
  expertiseRequired: {
    type: String,
    default: '',
  },
  externalResources: {
    type: String,
    default: '',
  },
  stage: {
    type: String,
    enum: ['submission', 'review', 'development', 'implementation', 'withdrawn'],
    default: 'submission',
  },
  // Voting Fields
  impactVotes: [{ type: Number }],
  feasibilityVotes: [{ type: Number }],
  costVotes: [{ type: Number }],
  alignmentVotes: [{ type: Number }],
  voters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
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
    default: 0, // Calculated based on other scores
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
module.exports = { Innovation, feedbackModel };
