const Department = require("../models/departmentModel");
const User = require("../models/userModel");
const MeetingBooking = require("../models/meetingBookingModel");
const Connection = require('../models/connectionModel');
const Notification = require('../models/notificationModel');
const moment = require("moment");
const { sendNotification } = require('../services/notificationService');


// Utility function to create a new connection between two users
const createConnection = async (userA, userB, context) => {
  try {
    console.log(`Attempting to create connection between ${userA} and ${userB} with context: ${context}`);

    const newConnection = new Connection({
      userA,
      userB,
      context,
      interactionCount: 1,
      lastInteractedAt: Date.now(),
    });

    const savedConnection = await newConnection.save();
    console.log(`Connection successfully created:`, savedConnection);

    return savedConnection;
  } catch (error) {
    console.error(`Error creating connection between ${userA} and ${userB} for context: ${context}:`, error.message);
  }
};

// Utility function to send notifications to users
const sendMeetingNotifications = async (users, message, link, senderId) => {
  try {
    for (const user of users) {
      const newNotification = new Notification({
        recipient: user,
        sender: senderId,
        message,
        type: 'info',
        link,
      });
      await newNotification.save();
      sendNotification(user, newNotification);  // Send real-time notification
    }
  } catch (error) {
    console.error('Error sending notifications:', error.message);
  }
};

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
    console.log("Received Booking Request Body:", req.body);
    
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

    const formattedTime = moment(time, 'h:mm A').format('h:mm A');

    const existingBooking = await MeetingBooking.findOne({
      user: selectedUser,
      date: moment(date).format("YYYY-MM-DD"),
      time: formattedTime,
    });

    if (existingBooking) {
      return res.status(400).json({ message: "This time slot is already booked." });
    }

    const booking = new MeetingBooking({
      user: selectedUser,
      bookedBy: userId,
      date: moment(date).format("YYYY-MM-DD"),
      time: formattedTime,
      duration,
      type,
      phoneNumber,
      agenda,
    });

    await booking.save();

    // Create a connection between the user and the selected user
    await createConnection(userId, selectedUser, 'meeting booking');

    // Send notifications to both users about the booking
    const notificationMessage = `A meeting has been booked between you and ${req.user.name}`;
    await sendMeetingNotifications([selectedUser, userId], notificationMessage, `/meetings/${booking._id}`, req.user._id);

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
    }).populate({
      path: 'user',
      select: 'name department position zoomLink',
      populate: { path: 'department', select: 'name' }  // Ensure department is populated
    });

    const bookedByOthers = await MeetingBooking.find({ user: userId }).populate({
      path: 'bookedBy',
      select: 'name department position zoomLink',
      populate: { path: 'department', select: 'name' }  // Ensure department is populated
    });

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
    const { userId, date, duration } = req.query;

    if (!duration) {
      return res.status(400).json({ message: "Duration is required." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Fetching availability for User ID:", userId);
    console.log("Selected Date:", date, "Duration:", duration);
    console.log("User's Disabled Dates:", user.availability);
    console.log("User's Time Ranges:", user.timeRanges);

    const isDateDisabled = user.availability.some(disabledDate => 
      moment(disabledDate).isSame(moment(date), 'day')
    );

    const timeRanges = user.timeRanges || [];

    // If the date is disabled and no specific time ranges are available, return no available times
    if (isDateDisabled && !timeRanges.length) {
      console.log("The selected date is fully disabled for this user.");
      return res.status(200).json({ availableTimes: [], bookedTimes: [], timeRanges });
    }

    const existingBookings = await MeetingBooking.find({ user: userId, date });
    console.log("Existing bookings on this date:", existingBookings);

    const bookedTimes = existingBookings.map(booking => ({
      time: booking.time,
      duration: booking.duration === '30 minutes' ? 30 : 60,
    }));

    // Pass the necessary parameters to generateAvailableTimes
    const allTimes = generateAvailableTimes(date, parseInt(duration, 10), bookedTimes, timeRanges);

    console.log("Generated All Times:", allTimes);

    const availableTimes = filterAvailableTimes(allTimes, bookedTimes, timeRanges, parseInt(duration, 10));

    console.log("Final Available Times:", availableTimes);

    res.status(200).json({ availableTimes, bookedTimes, timeRanges });
  } catch (error) {
    console.error("Error fetching user availability:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Updated generateAvailableTimes function to accept existingBookings and disabledTimes as parameters
const generateAvailableTimes = (date, duration, existingBookings, disabledTimes) => {
  const times = [];
  let currentTime = moment(date).hour(9).minute(0); // Start at 9 AM
  const endTime = moment(date).hour(17).minute(0);  // End at 5 PM

  while (currentTime.isBefore(endTime)) {
      const isBooked = existingBookings.some(booking => {
          const bookingStart = moment(`${booking.date} ${booking.time}`, 'YYYY-MM-DD h:mm A');
          const bookingEnd = bookingStart.clone().add(booking.duration, 'minutes');
          return currentTime.isBetween(bookingStart, bookingEnd, null, '[)');
      });

      const isDisabled = disabledTimes.some(disabled => {
          const disabledStart = moment(disabled.start);
          const disabledEnd = moment(disabled.end);
          return currentTime.isBetween(disabledStart, disabledEnd, null, '[)');
      });

      if (!isBooked && !isDisabled) {
          times.push(currentTime.clone());
      }

      currentTime.add(30, 'minutes');
  }

  return times;
};

// Helper function to filter available times based on booked and disabled slots
const filterAvailableTimes = (allTimes, bookedTimes, disabledRanges, duration) => {
  return allTimes.filter(time => {
    const startTime = moment(time, 'h:mm A');
    const endTime = startTime.clone().add(duration, 'minutes');

    // Log the times being checked
    console.log("Checking time:", time);

    // Check if the time slot overlaps with any booked time
    const isBooked = bookedTimes.some(booking => {
      const bookingStart = moment(booking.time, 'h:mm A');
      const bookingEnd = bookingStart.clone().add(booking.duration, 'minutes');

      console.log("Booking Start:", bookingStart.format('h:mm A'), "Booking End:", bookingEnd.format('h:mm A'));

      // Check for overlap with booked times
      const overlap = (startTime.isBefore(bookingEnd) && endTime.isAfter(bookingStart));
      console.log("Booked overlap condition met:", overlap);
      return overlap;
    });

    // Check if the time slot overlaps with any disabled range
    const isDisabled = disabledRanges.some(range => {
      const disabledStart = moment(range.start);
      const disabledEnd = moment(range.end);

      console.log("Disabled Start:", disabledStart.format('h:mm A'), "Disabled End:", disabledEnd.format('h:mm A'));

      // Check for overlap with disabled times
      const overlap = (startTime.isBefore(disabledEnd) && endTime.isAfter(disabledStart));
      console.log("Disabled overlap condition met:", overlap);
      return overlap;
    });

    console.log("Is Booked:", isBooked, "Is Disabled:", isDisabled);

    // Only return the time if it is neither booked nor disabled
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

    console.log("Updating availability for User ID:", userId);
    console.log("Disable Range Provided:", disableRange);

    // Assuming disableRange.timeRanges is an array of date objects or valid date strings
    user.availability = disableRange.datesToDisable || [];
    user.timeRanges = disableRange.timeRanges || [];
    await user.save();

    console.log("User availability updated successfully");

    // Notify the user about the updated availability
    const notificationMessage = `Your availability has been updated. Please review your schedule.`;
    const newNotification = new Notification({
      recipient: userId,
      sender: req.user._id,
      message: notificationMessage,
      type: 'info',
      link: '/user/profile',  // Assume this is the link to the user's profile
    });

    await newNotification.save();
    sendNotification(userId, newNotification); // Send real-time notification

    res.json({ message: "User availability updated successfully" });
  } catch (error) {
    console.error("Error updating user availability:", error.message);
    res.status(500).json({ message: error.message });
  }
};


// @desc    Update meeting status
// @route   PUT /api/booking/status/:id
// @access  Private
const updateMeetingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const booking = await MeetingBooking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = status;
    await booking.save();

    // Notify users about the meeting status update
    const notificationMessage = `The meeting status has been updated to ${status}`;
    await sendMeetingNotifications([booking.user, booking.bookedBy], notificationMessage, `/meetings/${booking._id}`, req.user._id);

    res.status(200).json({ message: "Meeting status updated successfully" });
  } catch (error) {
    console.error("Error updating meeting status:", error.message);
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  getDepartmentsAndUsers,
  createBooking,
  getBookingsForUser,
  updateUserAvailability,
  getUserAvailability,
  updateMeetingStatus,
};
