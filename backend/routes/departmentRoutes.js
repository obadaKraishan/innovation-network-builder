const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware');
const {
  getDepartments,
  getTheDepartments, // Importing the new function
  addDepartment,
  editDepartment,
  deleteDepartment,
} = require('../controllers/departmentController');

const router = express.Router();

router.route('/')
  .get(protect, admin, getDepartments)
  .post(protect, admin, addDepartment);

router.route('/full')
  .get(protect, admin, getTheDepartments); // Adding a new route for the full department hierarchy

router.route('/:id')
  .put(protect, admin, editDepartment)
  .delete(protect, admin, deleteDepartment);

module.exports = router;
