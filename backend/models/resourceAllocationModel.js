const mongoose = require('mongoose');

const resourceAllocationSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Innovation',
    required: true,
  },
  budget: {
    type: Number,
    required: true,
  },
  teamMembers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  resourcesUsed: {
    budget: {
      type: Number,
      default: 0,
    },
    time: {
      type: String,
      default: '0 hours',
    },
    manpower: {
      type: Number,
      default: 0,
    },
  },
  estimatedCompletionTime: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ResourceAllocation = mongoose.model('ResourceAllocation', resourceAllocationSchema);

module.exports = ResourceAllocation;
