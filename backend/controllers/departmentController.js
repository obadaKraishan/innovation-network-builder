const Department = require('../models/departmentModel');

// @desc    Get all main departments (excluding sub-departments)
// @route   GET /api/departments
// @access  Private
const getDepartments = async (req, res) => {
  try {
    // Find departments that do not have a parentDepartment field set (i.e., they are main departments)
    const departments = await Department.find({ parentDepartment: null });
    res.json(departments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDepartments,
};
