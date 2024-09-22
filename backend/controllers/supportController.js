// File: backend/controllers/supportController.js

const Ticket = require('../models/ticketModel');
const User = require('../models/userModel');

// Submit a new ticket
const submitTicket = async (req, res) => {
  try {
    const { description, priority } = req.body;
    const attachments = req.file ? req.file.filename : null; // Save the file path or filename

    const ticket = await Ticket.create({
      ticketId: `TICKET-${Date.now()}`,
      userId: req.user._id,
      description,
      priority,
      attachments,
    });

    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate('assignedTo', 'name');
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    res.status(200).json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Assign a user to a ticket
const assignTicket = async (req, res) => {
  try {
    const { userId } = req.body;
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    ticket.assignedTo = userId;
    await ticket.save();
    res.status(200).json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
    const tickets = await Ticket.find();
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update ticket status (for Technical Support)
const updateTicketStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    ticket.status = status;
    ticket.updatedAt = Date.now();
    await ticket.save();

    res.status(200).json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
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

module.exports = {
  submitTicket,
  getTicketById,
  assignTicket,
  getUserTickets,
  getAllTickets,
  updateTicketStatus,
  filterTickets,
  getRecentTickets,
};
