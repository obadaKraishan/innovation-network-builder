// File: backend/models/messageModel.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  recipients: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }],
  cc: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  subject: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  attachments: [{
    filename: String,
    path: String,
  }],
  isImportant: {
    type: Boolean,
    default: false,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  parentMessage: {
    type: Schema.Types.ObjectId,
    ref: 'Message',
  },
  childMessages: [{
    type: Schema.Types.ObjectId,
    ref: 'Message',
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
