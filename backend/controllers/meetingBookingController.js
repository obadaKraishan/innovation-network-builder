const Department = require("../models/departmentModel");
const User = require("../models/userModel");
const MeetingBooking = require("../models/meetingBookingModel");
const moment = require("moment");

// @desc    Get departments and users for booking
// @route   GET /api/booking/departments
// @access  Private
const getDepartmentsAndUsers = async (req, res) => {
  try {
    const departments = await Department.find();
    const users = await User.find().select(
      "name department position email zoomLink"
    );
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
    const {
      userId,
      selectedUser,
      date,
      time,
      duration,
      type,
      phoneNumber,
      agenda,
    } = req.body;

    const existingBooking = await MeetingBooking.findOne({
      user: selectedUser,
      date: moment(date).format("YYYY-MM-DD"),
      time,
    });

    if (existingBooking) {
      return res
        .status(400)
        .json({ message: "This time slot is already booked." });
    }

    const booking = new MeetingBooking({
      user: selectedUser,
      bookedBy: userId,
      date: moment(date).format("YYYY-MM-DD"),
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

// @desc    Get bookings for a user (both booked by and booked with)
// @route   GET /api/booking
// @access  Private
const getBookingsForUser = async (req, res) => {
  try {
    const { userId } = req.query;
    const bookedWithOthers = await MeetingBooking.find({
      bookedBy: userId,
    }).populate("user", "name department position zoomLink");
    const bookedByOthers = await MeetingBooking.find({ user: userId }).populate(
      "bookedBy",
      "name department position zoomLink"
    );

    res.json({ bookedWithOthers, bookedByOthers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get availability of a user for a specific date
// @route   GET /api/booking/availability
// @access  Private
const getUserAvailability = async (req, res) => {
    try {
      const { userId, date } = req.query;
      console.log(`Received userId: ${userId}, date: ${date}`);
  
      // Find the user and their availability
      const user = await User.findById(userId);
      if (!user) {
        console.error("User not found");
        return res.status(404).json({ message: "User not found" });
      }
  
      console.log("User found:", user);
  
      // Check if the date is in the user's disabled dates
      const isDateDisabled = user.availability.some(disabledDate => {
        return moment(disabledDate).isSame(moment(date), 'day');
      });
  
      if (isDateDisabled) {
        console.log("Date is disabled for this user");
        return res.status(200).json({ availableTimes: [] });
      }
  
      // Return available times (dummy data for example)
      const availableTimes = ["10:00 AM", "11:00 AM", "2:00 PM", "4:00 PM"];
      console.log("Available times:", availableTimes);
      
      res.status(200).json({ availableTimes });
    } catch (error) {
      console.error("Error fetching user availability:", error.message);
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
      return res.status(404).json({ message: "User not found" });
    }

    user.availability = datesToDisable;
    await user.save();

    res.json({ message: "User availability updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDepartmentsAndUsers,
  createBooking,
  getBookingsForUser,
  updateUserAvailability,
  getUserAvailability
};
