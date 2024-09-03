const Department = require('../models/departmentModel');
const User = require('../models/userModel');
const MeetingBooking = require('../models/meetingBookingModel'); // Assuming you have created this model
const moment = require('moment');

// @desc    Get departments and users for booking
// @route   GET /api/booking/departments
// @access  Private
const getDepartmentsAndUsers = async (req, res) => {
  try {
    const departments = await Department.find();
    const users = await User.find().select('name department position email');
    
    res.json({ departments, users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new booking
// @route   POST /api/booking
// @access  Private
const createBooking = async (req, res) => {
  try {
    const { userId, selectedUser, date, time, duration, type, phoneNumber, agenda } = req.body;
    
    const existingBooking = await MeetingBooking.findOne({
      user: selectedUser,
      date: moment(date).format('YYYY-MM-DD'),
      time,
    });

    if (existingBooking) {
      return res.status(400).json({ message: 'This time slot is already booked.' });
    }

    const booking = new MeetingBooking({
      user: selectedUser,
      bookedBy: userId,
      date: moment(date).format('YYYY-MM-DD'),
      time,
      duration,
      type,
      phoneNumber,
      agenda,
    });

    await booking.save();
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get bookings for a user
// @route   GET /api/booking
// @access  Private
const getBookingsForUser = async (req, res) => {
  try {
    const { userId } = req.query;
    const bookings = await MeetingBooking.find({ user: userId });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user availability
// @route   PUT /api/booking/availability
// @access  Private
const updateUserAvailability = async (req, res) => {
  try {
    const { userId, datesToDisable } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.availability = datesToDisable;
    await user.save();

    res.json({ message: 'User availability updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDepartmentsAndUsers,
  createBooking,
  getBookingsForUser,
  updateUserAvailability,
};
