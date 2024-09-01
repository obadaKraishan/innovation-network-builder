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
    type: String,
    enum: ['Strong Tie', 'Weak Tie'], // Ensure these are the correct intended values
    default: 'Weak Tie',
  },
  context: {
    type: String,
    enum: ['team', 'discussion', 'task'], // Ensure these match the values you intend to use
    required: true,
  },
  interactionCount: {
    type: Number,
    default: 1, // Default to 1 instead of 0 since it represents an interaction
  },
  lastInteractedAt: {
    type: Date,
    default: Date.now,
  },
  connectionStrength: {
    type: String,
    enum: ['Strong', 'Medium', 'Weak'],
    default: 'Weak',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Connection = mongoose.model('Connection', connectionSchema);

module.exports = Connection;
