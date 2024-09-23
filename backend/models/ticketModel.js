// File: backend/models/ticketModel.js

const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  ticketId: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    default: true,
  },
  status: {
    type: String,
    enum: ['New', 'In Progress', 'Closed'],
    default: 'New',
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium',
  },
  description: {
    type: String,
    required: true,
  },
  attachments: [String],
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  feedback: [
    {
      comment: { type: String, required: true },
      date: { type: Date, default: Date.now },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  history: [
    {
      action: String,
      timestamp: Date,
      comment: String,
      updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    },
  ],
});

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
