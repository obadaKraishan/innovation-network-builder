// File: backend/routes/userRoutes.js

const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware');
const { 
  getUsers, 
  getUserById, 
  searchUsers, 
  getSkills, 
  updateUserInfo, 
  updateUserPassword,
  getMyTeam
} = require('../controllers/userController');

const router = express.Router();

// Use the protect middleware for routes that require authentication
router.route('/my-team').get(protect, getMyTeam); // Add the my-team route
router.route('/').get(protect, admin, getUsers);
router.route('/search').get(protect, searchUsers); // Add the search route
router.route('/skills').get(protect, getSkills); // Add the skills route
router.route('/:id').get(protect, getUserById); // Get user by ID
router.route('/:id').put(protect, updateUserInfo); // Update user information (only name and skills)
router.route('/:id/password').put(protect, updateUserPassword); // Update user password

module.exports = router;
