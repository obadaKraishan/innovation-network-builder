const mongoose = require('mongoose');

const connectionSchema = new mongoose.Schema({
  userA: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userB: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  connectionType: {
    type: String,  // Removed enum restriction to allow for flexible connection types
    default: 'Weak Tie',
  },
  context: {
    type: String,  // Removed enum restriction to allow for any context
    required: true,
  },
  interactionCount: {
    type: Number,
    default: 1,
  },
  lastInteractedAt: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Connection = mongoose.model('Connection', connectionSchema);

module.exports = Connection;
