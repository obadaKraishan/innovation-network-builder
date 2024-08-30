const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const discussionSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  comment: String,
  parent: { type: Schema.Types.ObjectId, ref: 'Discussion', default: null }, // Added for replies
  createdAt: { type: Date, default: Date.now },
});

const teamSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  members: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }],
  teamLeader: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  department: {
    type: Schema.Types.ObjectId,
    ref: 'Department',
    required: true,
  },
  objective: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  tasks: [{
    type: Schema.Types.ObjectId,
    ref: 'Task',
  }],
  discussions: [discussionSchema], // Updated to use discussionSchema
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

module.exports = mongoose.model('Team', teamSchema);
