const Department = require('../models/departmentModel');
const User = require('../models/userModel'); // Assuming you have a user model

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
    const departments = await Department.find({ parentDepartment: null });

    const departmentsWithSubs = await Promise.all(departments.map(async (department) => {
      const subDepartments = await Department.find({ parentDepartment: department._id });
      return {
        ...department.toObject(),
        subDepartments,
      };
    }));

    res.json(departmentsWithSubs);
  } catch (error) {
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

// @desc    Delete a department and its sub-departments
// @route   DELETE /api/departments/:id
// @access  Private
const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);

    if (!department) {
      console.error(`Department with ID ${req.params.id} not found`);
      return res.status(404).json({ message: 'Department not found' });
    }

    console.log(`Deleting department: ${department.name}`);

    // Delete all sub-departments recursively
    await deleteSubDepartments(department._id);

    // Optionally, remove users associated with this department
    await User.updateMany({ department: department._id }, { $unset: { department: '' } });

    // Use `findByIdAndDelete` method to delete the department
    await Department.findByIdAndDelete(req.params.id);

    res.json({ message: 'Department removed' });
  } catch (error) {
    console.error(`Error deleting department: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

// Helper function to delete sub-departments recursively
const deleteSubDepartments = async (parentDepartmentId) => {
  const subDepartments = await Department.find({ parentDepartment: parentDepartmentId });
  
  for (const subDept of subDepartments) {
    await deleteSubDepartments(subDept._id); // Recursively delete sub-departments
    await subDept.remove(); // Remove the sub-department
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
  getTheDepartments,
  addDepartment,
  editDepartment,
  deleteDepartment,
  getDepartmentById,
};
