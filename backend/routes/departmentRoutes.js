const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware');
const {
  getDepartments,
  getTheDepartments,
  getDepartmentById,
  addParentDepartment,
  addSubDepartment,
  editDepartment,
  deleteDepartment,
} = require('../controllers/departmentController');

const router = express.Router();

router.route('/')
  .get(protect, admin, getDepartments);

router.route('/parent')
  .post(protect, admin, addParentDepartment);

router.route('/sub')
  .post(protect, admin, addSubDepartment);

router.route('/full')
  .get(protect, admin, getTheDepartments);

router.route('/:id')
  .get(protect, admin, getDepartmentById)
  .put(protect, admin, editDepartment)
  .delete(protect, admin, deleteDepartment);

module.exports = router;
