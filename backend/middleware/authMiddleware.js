// File: backend/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

// Middleware to protect routes with JWT authentication
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
      console.log('Token received in middleware:', token);

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded token:', decoded);

      // Get user from the token
      req.user = await User.findById(decoded.id).select('-password');
      console.log('User retrieved in middleware:', req.user);

      if (!req.user) {
        console.error('User not found for the given token');
        return res.status(404).json({ message: 'User not found' });
      }

      console.log('User authenticated successfully');
      next();
    } catch (error) {
      console.error('Error verifying token:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    console.warn('No token provided in request.');
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
});

// Middleware to allow any authenticated user to view users in the Personal Interest Groups system
const allowEmployees = asyncHandler(async (req, res, next) => {
  console.log('Allow Employees middleware triggered for user:', req.user.role);

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Allow access to any authenticated user, regardless of role
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
});

// Middleware to protect routes with JWT authentication specifically for message-related routes
const protectForMessages = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded token:', decoded);

      // Get user from the token
      req.user = await User.findById(decoded.id).select('-password');
      console.log('User retrieved in middleware:', req.user);

      if (!req.user) {
        return res.status(404).json({ message: 'User not found' });
      }

      next();
    } catch (error) {
      console.error('Error verifying token for messages:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
});

// Middleware to check if the user has admin privileges
const admin = (req, res, next) => {
  console.log('Admin middleware triggered', req.user.role);
  const adminRoles = [
    'Executive',
    'CEO',
    'CTO',
    'Director of HR',
    'Director of Finance',
    'Team Leader',
    'Department Manager',
    'Legal Advisor',               // Added roles
    'Product Manager',             // Added roles
    'Research Scientist',          // Added roles
    'Customer Support Specialist', // Added roles
  ];

  if (req.user && adminRoles.includes(req.user.role)) {
    next();
  } else {
    console.warn('User is not authorized as an admin:', req.user ? req.user.role : 'No user');
    return res.status(403).json({ message: 'Not authorized as an admin' });
  }
};

// Middleware to check if the user has CEO or authorized role privileges
const ceoOrAuthorized = (req, res, next) => {
  if (req.user && ['CEO', 'Director of HR', 'Director of Finance'].includes(req.user.role)) {
    next();
  } else {
    console.warn('User is not authorized as CEO or authorized role:', req.user ? req.user.role : 'No user');
    return res.status(403).json({ message: 'Not authorized as CEO or authorized role' });
  }
};

module.exports = { protect, protectForMessages, admin, ceoOrAuthorized, allowEmployees };
