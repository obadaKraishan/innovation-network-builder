const express = require('express');
const {
  getDepartmentsAndUsers,
  createBooking,
  getBookingsForUser,
  updateUserAvailability,
} = require('../controllers/meetingBookingController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/departments').get(protect, getDepartmentsAndUsers);
router.route('/').post(protect, createBooking);
router.route('/').get(protect, getBookingsForUser);
router.route('/availability').put(protect, updateUserAvailability);

module.exports = router;
