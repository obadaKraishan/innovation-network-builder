const Department = require('../models/departmentModel');

// @desc    Get all main departments (excluding sub-departments)
// @route   GET /api/departments
// @access  Private
const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find({ parentDepartment: null });
    res.json(departments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all departments with their sub-departments
// @route   GET /api/departments/full
// @access  Private
const getTheDepartments = async (req, res) => {
  try {
    // Fetch all main departments
    const departments = await Department.find({ parentDepartment: null });

    // Populate sub-departments manually
    const departmentsWithSubs = await Promise.all(departments.map(async (department) => {
      const subDepartments = await Department.find({ parentDepartment: department._id });
      return {
        ...department.toObject(), // Convert Mongoose document to plain object
        subDepartments,
      };
    }));

    res.json(departmentsWithSubs);
  } catch (error) {
    console.error('Error fetching departments:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a new department
// @route   POST /api/departments
// @access  Private
const addDepartment = async (req, res) => {
  try {
    const { name, parent } = req.body;
    const department = new Department({ name, parentDepartment: parent || null });

    if (parent) {
      const parentDepartment = await Department.findById(parent);
      parentDepartment.subDepartments.push(department._id);
      await parentDepartment.save();
    }

    await department.save();
    res.status(201).json(department);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Edit a department
// @route   PUT /api/departments/:id
// @access  Private
const editDepartment = async (req, res) => {
  try {
    const { name, parent } = req.body;
    const department = await Department.findById(req.params.id);

    if (department) {
      department.name = name || department.name;
      department.parentDepartment = parent || department.parentDepartment;

      await department.save();
      res.json(department);
    } else {
      res.status(404).json({ message: 'Department not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a department
// @route   DELETE /api/departments/:id
// @access  Private
const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);

    if (department) {
      await department.remove();
      res.json({ message: 'Department removed' });
    } else {
      res.status(404).json({ message: 'Department not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a department by ID
// @route   GET /api/departments/:id
// @access  Private
const getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);

    if (department) {
      const subDepartments = await Department.find({ parentDepartment: department._id });
      res.json({
        ...department.toObject(),
        subDepartments,
      });
    } else {
      res.status(404).json({ message: 'Department not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDepartments,
  getTheDepartments, // New function added
  addDepartment,
  editDepartment,
  deleteDepartment,
  getDepartmentById,
};
