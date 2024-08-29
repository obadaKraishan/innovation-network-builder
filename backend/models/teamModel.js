const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
    task: String,
    deadline: Date,
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed'],
      default: 'Pending',
    },
  }],
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
