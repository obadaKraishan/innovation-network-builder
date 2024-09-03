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
    const departmentIds = departments.map(dept => dept._id);

    // Fetch users that belong to the selected department and its sub-departments
    const users = await User.find({ department: { $in: departmentIds } }).select("name department position email zoomLink");
    res.json({ departments, users });
  } catch (error) {
    console.error("Error fetching departments and users:", error.message);
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
      return res.status(400).json({ message: "This time slot is already booked." });
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
    console.error("Error creating booking:", error.message);
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
    console.error("Error fetching bookings for user:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get availability of a user for a specific date
// @route   GET /api/booking/availability
// @access  Private
const getUserAvailability = async (req, res) => {
  try {
    const { userId, date } = req.query;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isDateDisabled = user.availability.some(disabledDate => {
      return moment(disabledDate).isSame(moment(date), 'day');
    });

    if (isDateDisabled) {
      return res.status(200).json({ availableTimes: [], bookedTimes: [] });
    }

    const existingBookings = await MeetingBooking.find({ user: userId, date });

    const bookedTimes = existingBookings.map(booking => ({
      time: booking.time,
      duration: booking.duration === '30 minutes' ? 30 : 60,
    }));

    res.status(200).json({ availableTimes: [], bookedTimes });
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
    console.error("Error updating user availability:", error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDepartmentsAndUsers,
  createBooking,
  getBookingsForUser,
  updateUserAvailability,
  getUserAvailability,
};
