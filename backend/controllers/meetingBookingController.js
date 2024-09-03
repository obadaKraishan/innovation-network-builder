const Department = require("../models/departmentModel");
const User = require("../models/userModel");
const MeetingBooking = require("../models/meetingBookingModel");
const moment = require("moment");

// @desc    Get departments and users for booking
// @route   GET /api/booking/departments
// @access  Private
const getDepartmentsAndUsers = async (req, res) => {
  try {
    // Fetch all departments, including sub-departments
    const departments = await Department.find().lean();

    // Get all department IDs, including sub-departments
    const departmentMap = departments.reduce((map, dept) => {
      map[dept._id] = dept;
      return map;
    }, {});

    // Fetch users associated with these departments
    const users = await User.find({ department: { $in: Object.keys(departmentMap) } })
      .select("name email department role position zoomLink skills availability")
      .populate('department', 'name');  // Populate department name

    // Structure departments into main departments with sub-departments nested
    const structuredDepartments = departments
      .filter(dept => !dept.parentDepartment)
      .map(mainDept => ({
        ...mainDept,
        subDepartments: departments.filter(subDept => String(subDept.parentDepartment) === String(mainDept._id))
      }));

    res.json({ departments: structuredDepartments, users });
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

    if (!userId) {
      return res.status(400).json({ message: "User ID (bookedBy) is required" });
    }

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
    const { userId, date, duration } = req.query; // Make sure to retrieve 'duration' here

    if (!duration) {
      return res.status(400).json({ message: "Duration is required." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the date is disabled or within any disabled time ranges
    const isDateDisabled = user.availability.some(disabledDate => {
      return moment(disabledDate).isSame(moment(date), 'day');
    });

    const timeRanges = user.timeRanges || [];

    // If the date is disabled, return early with no available times
    if (isDateDisabled) {
      return res.status(200).json({ availableTimes: [], bookedTimes: [], timeRanges });
    }

    // Get existing bookings for this user on the selected date
    const existingBookings = await MeetingBooking.find({ user: userId, date });

    // Map booked times to an array
    const bookedTimes = existingBookings.map(booking => ({
      time: booking.time,
      duration: booking.duration === '30 minutes' ? 30 : 60,
    }));

    // Create an array of all available times between 09:00 AM and 05:00 PM
    const allTimes = generateAvailableTimes(moment('09:00 AM', 'h:mm A'), moment('05:00 PM', 'h:mm A'), parseInt(duration, 10));

    // Filter out times that are already booked or disabled
    const availableTimes = filterAvailableTimes(allTimes, bookedTimes, timeRanges, parseInt(duration, 10));

    res.status(200).json({ availableTimes, bookedTimes, timeRanges });
  } catch (error) {
    console.error("Error fetching user availability:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Helper function to generate available times
const generateAvailableTimes = (startTime, endTime, duration) => {
  const times = [];
  let currentTime = startTime.clone();
  while (currentTime.isBefore(endTime)) {
    times.push(currentTime.format('h:mm A'));
    currentTime.add(duration, 'minutes');
  }
  return times;
};

// Helper function to filter available times based on booked and disabled slots
const filterAvailableTimes = (allTimes, bookedTimes, disabledRanges, duration) => {
  return allTimes.filter(time => {
    const bookingTime = moment(time, 'h:mm A');
    const endTime = bookingTime.clone().add(duration, 'minutes');

    const isBooked = bookedTimes.some(booking => {
      const bookingStart = moment(booking.time, 'h:mm A');
      const bookingEnd = bookingStart.clone().add(booking.duration, 'minutes');
      return bookingTime.isBetween(bookingStart, bookingEnd, null, '[)') ||
             endTime.isBetween(bookingStart, bookingEnd, null, '(]');
    });

    const isDisabled = disabledRanges.some(range => {
      const disabledStart = moment(range.start);
      const disabledEnd = moment(range.end);
      return bookingTime.isBetween(disabledStart, disabledEnd, null, '[)') ||
             endTime.isBetween(disabledStart, disabledEnd, null, '(]');
    });

    return !isBooked && !isDisabled;
  });
};


// @desc    Update user availability
// @route   PUT /api/booking/availability
// @access  Private
const updateUserAvailability = async (req, res) => {
  try {
    const { userId, disableRange } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.availability = disableRange.datesToDisable || [];
    user.timeRanges = disableRange.timeRanges || [];
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
