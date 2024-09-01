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
      console.error('Error verifying token:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    console.warn('No token provided in request.');
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
});

// Middleware to check if the user has admin privileges
const admin = (req, res, next) => {
  if (
    req.user &&
    ['Executive', 'CEO', 'CTO', 'Director of HR', 'Director of Finance', 'Team Leader', 'Department Manager'].includes(req.user.role)
  ) {
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

module.exports = { protect, admin, ceoOrAuthorized };
