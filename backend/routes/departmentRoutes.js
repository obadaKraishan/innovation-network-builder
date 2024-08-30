const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware');
const {
  getDepartments,
  getTheDepartments,
  getDepartmentById, // Import the new function
  addDepartment,
  editDepartment,
  deleteDepartment,
} = require('../controllers/departmentController');

const router = express.Router();

router.route('/')
  .get(protect, admin, getDepartments)
  .post(protect, admin, addDepartment);

router.route('/full')
  .get(protect, admin, getTheDepartments);

router.route('/:id')
  .get(protect, admin, getDepartmentById) // Add this route to fetch a department by ID
  .put(protect, admin, editDepartment)
  .delete(protect, admin, deleteDepartment);

module.exports = router;
