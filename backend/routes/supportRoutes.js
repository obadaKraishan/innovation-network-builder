// File: backend/routes/supportRoutes.js

const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware');
const {
  submitTicket,
  getTicketById,
  assignTicket,
  getUserTickets,
  getAllTickets,
  updateTicketStatus,
  filterTickets,
  getRecentTickets,
} = require('../controllers/supportController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // This will store files in the 'uploads' folder

const router = express.Router();

// Routes for regular users
router.route('/').post(protect, upload.single('attachments'), submitTicket); // Enable file upload
router.route('/').post(protect, submitTicket); // Submit a new ticket
router.route('/my-tickets').get(protect, getUserTickets); // View own tickets

// Routes for Technical Support (Admin)
router.route('/all').get(protect, admin, getAllTickets); // View all tickets
router.route('/:id/status').put(protect, admin, updateTicketStatus); // Update ticket status
router.route('/filter').post(protect, admin, filterTickets); // Filter tickets

router.route('/:id').get(protect, admin, getTicketById); // Get ticket by ID
router.route('/:id/assign').put(protect, admin, assignTicket); // Assign user to ticket

// ** New route for recent tickets **
router.route('/recent-tickets').get(protect, admin, getRecentTickets); // Add this line

module.exports = router;
