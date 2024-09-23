// File: backend/controllers/supportController.js

const Ticket = require('../models/ticketModel');
const User = require('../models/userModel');

// Submit a new ticket
const submitTicket = async (req, res) => {
  try {
    const { description, priority } = req.body;
    const attachments = req.file ? req.file.filename : null; // Save the file path or filename

    // Fetch the user from the database to get the department
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create the ticket using the user's department
    const ticket = await Ticket.create({
      ticketId: `TICKET-${Date.now()}`,
      userId: req.user._id,
      description,
      priority,
      department: user.department, // Use user's department
      attachments,
    });

    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all tickets for a user
const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findOne({ ticketId: req.params.id })
      .populate('userId', 'name department') // Populates user and department fields from User
      .populate({
        path: 'department',
        populate: [
          { path: 'parentDepartment', select: 'name' }, // Populate the parent department name
          { path: 'manager', select: 'name' }, // Populate the manager's name
        ],
      }) // Populate department with name, parentDepartment, and manager
      .populate('assignedTo', 'name'); // Populate the assigned user’s name

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.status(200).json(ticket);
  } catch (error) {
    console.error('Error fetching ticket:', error);
    res.status(500).json({ message: 'Server error occurred while fetching the ticket', error: error.message });
  }
};

// Assign a user to a ticket
const assignTicket = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required to assign a ticket' });
    }

    const ticket = await Ticket.findOne({ ticketId: req.params.id });
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    const user = await User.findById(userId);
    if (!user || user.position !== 'Technical Support Specialist') {
      return res.status(400).json({ message: 'Invalid user or user is not a Technical Support Specialist' });
    }

    ticket.assignedTo = userId;
    await ticket.save();
    res.status(200).json(ticket);
  } catch (error) {
    console.error('Error assigning ticket:', error);
    res.status(500).json({ message: 'Server error occurred while assigning the ticket' });
  }
};

// Get tickets for a specific user
const getUserTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ userId: req.user._id });
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all tickets (for Technical Support)
const getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find()
      .populate('userId', 'name department') // Populate user fields
      .populate({
        path: 'department',
        populate: [
          { path: 'parentDepartment', select: 'name' }, // Populate parent department name
          { path: 'manager', select: 'name' }, // Populate manager's name
        ],
      }) // Populate department details
      .populate('assignedTo', 'name'); // Populate assigned user

    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update ticket status (for Technical Support)
const updateTicketStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['New', 'In Progress', 'Closed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const ticket = await Ticket.findOne({ ticketId: req.params.id });
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    ticket.status = status;
    ticket.updatedAt = Date.now();
    await ticket.save();

    res.status(200).json(ticket);
  } catch (error) {
    console.error('Error updating ticket status:', error);
    res.status(500).json({ message: 'Server error occurred while updating the ticket status' });
  }
};

// Filter tickets based on status, priority, etc.
const filterTickets = async (req, res) => {
  try {
    const { status, priority, dateRange } = req.body;
    const query = {};

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (dateRange) {
      query.createdAt = {
        $gte: new Date(dateRange.startDate),
        $lte: new Date(dateRange.endDate),
      };
    }

    const tickets = await Ticket.find(query);
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get tickets from the last 7 days
const getRecentTickets = async (req, res) => {
    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
      const recentTickets = await Ticket.find({
        createdAt: { $gte: sevenDaysAgo },
      });
  
      res.status(200).json(recentTickets);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

// Add feedback to a ticket
const addTicketFeedback = async (req, res) => {
  try {
    const { comment } = req.body;
    if (!comment) {
      return res.status(400).json({ message: 'Feedback comment is required' });
    }

    const ticket = await Ticket.findOne({ ticketId: req.params.id });
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    ticket.feedback.push({ comment });
    await ticket.save();

    res.status(200).json(ticket);
  } catch (error) {
    console.error('Error adding feedback:', error);
    res.status(500).json({ message: 'Server error occurred while adding feedback' });
  }
};

module.exports = {
  submitTicket,
  getTicketById,
  assignTicket,
  getUserTickets,
  getAllTickets,
  updateTicketStatus,
  filterTickets,
  getRecentTickets,
  addTicketFeedback,
};
