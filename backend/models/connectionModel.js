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
    enum: ['Strong Tie', 'Weak Tie'],
    default: 'Weak Tie',
  },
  context: {
    type: String,
    enum: ['team', 'discussion', 'task'],
    required: true,
  },
  interactionCount: {
    type: Number,
    default: 0,
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
