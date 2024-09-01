// File: backend/routes/userRoutes.js

const express = require('express');
const { protect, admin, ceoOrAuthorized } = require('../middleware/authMiddleware'); 
const { 
  getUsers, 
  getUserById, 
  searchUsers, 
  getSkills, 
  updateUserInfo, 
  updateUserPassword,
  getMyTeam,
  getUsersByDepartment,
  getUsersByDepartmentForTeams,
  manageUsers,
  addUser
} = require('../controllers/userController');

const router = express.Router();

// Define routes
router.route('/my-team').get(protect, getMyTeam);
router.route('/department-users').get(protect, getUsersByDepartment);
router.route('/department-users-for-teams').get(protect, getUsersByDepartmentForTeams);
router.route('/manage-users').get(protect, ceoOrAuthorized, manageUsers);
router.route('/').get(protect, admin, getUsers);
router.route('/').post(protect, admin, addUser); 
router.route('/search').get(protect, searchUsers);
router.route('/skills').get(protect, getSkills);
router.route('/:id').get(protect, getUserById);
router.route('/:id').put(protect, updateUserInfo);
router.route('/:id/password').put(protect, updateUserPassword);

module.exports = router;
