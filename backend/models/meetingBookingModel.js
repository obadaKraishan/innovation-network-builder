const mongoose = require('mongoose');

const meetingBookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  bookedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['Zoom', 'Phone'],
    required: true,
  },
  phoneNumber: {
    type: String,
  },
  agenda: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const MeetingBooking = mongoose.model('MeetingBooking', meetingBookingSchema);

module.exports = MeetingBooking;
