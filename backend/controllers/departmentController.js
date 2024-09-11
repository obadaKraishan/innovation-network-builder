const Department = require('../models/departmentModel');
const User = require('../models/userModel'); // Assuming you have a user model
const Notification = require('../models/notificationModel');
const { sendNotification } = require('../services/notificationService');

// Utility function to send notifications to users
const sendDepartmentNotifications = async (users, message, link, senderId) => {
  try {
    for (const user of users) {
      const newNotification = new Notification({
        recipient: user,
        sender: senderId,
        message,
        type: 'info',
        link,
      });
      await newNotification.save();
      sendNotification(user, newNotification); // Send real-time notification
    }
  } catch (error) {
    console.error('Error sending notifications:', error.message);
  }
};

// @desc    Get all main departments (excluding sub-departments)
// @route   GET /api/departments
// @access  Private
const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find({ parentDepartment: null });
    res.json(departments);
  } catch (error) {
    res.status(500).json({ message: error.message }); // Return the error message
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
    res.status(500).json({ message: error.message }); // Return the error message
  }
};

// @desc    Get all main departments (excluding sub-departments)
// @route   GET /api/departments/main
// @access  Private
const getMainDepartmentsOnly = async (req, res) => {
  try {
    const departments = await Department.find({ parentDepartment: null });
    res.json(departments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get sub-departments based on parent department
// @route   GET /api/departments/sub-departments
// @access  Private
const getSubDepartmentsOnly = async (req, res) => {
  try {
    const { parentDepartment } = req.query;
    const subDepartments = await Department.find({ parentDepartment });
    res.json(subDepartments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a new parent department
// @route   POST /api/departments/parent
// @access  Private
const addParentDepartment = async (req, res) => {
  try {
    const { name } = req.body;
    const department = new Department({ name });
    await department.save();

    console.log(`New parent department created: ${department.name}`); // Log the new department

    // Send notifications to users about the new department
    const allUsers = await User.find().select('_id');
    const userIds = allUsers.map(user => user._id);
    const notificationMessage = `A new parent department named "${department.name}" has been added.`;
    await sendDepartmentNotifications(userIds, notificationMessage, `/departments/${department._id}`, req.user._id);

    res.status(201).json(department);
  } catch (error) {
    res.status(500).json({ message: error.message }); // Return the error message
  }
};

// @desc    Add a new sub-department
// @route   POST /api/departments/sub
// @access  Private
const addSubDepartment = async (req, res) => {
  try {
    const { name, parent } = req.body;
    if (!parent) {
      return res.status(400).json({ message: 'Parent department is required for sub-department.' });
    }

    const parentDepartment = await Department.findById(parent);
    if (!parentDepartment) {
      return res.status(404).json({ message: 'Parent department not found.' });
    }

    const department = new Department({ name, parentDepartment: parent });
    await department.save();

    parentDepartment.subDepartments.push(department._id);
    await parentDepartment.save();

    console.log(`Sub-department "${name}" added under "${parentDepartment.name}"`); // Log sub-department

    // Send notifications to users about the new sub-department
    const allUsers = await User.find().select('_id');
    const userIds = allUsers.map(user => user._id);
    const notificationMessage = `A new sub-department named "${department.name}" has been added under "${parentDepartment.name}".`;
    await sendDepartmentNotifications(userIds, notificationMessage, `/departments/${department._id}`, req.user._id);

    res.status(201).json(department);
  } catch (error) {
    res.status(500).json({ message: error.message }); // Return the error message
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

      console.log(`Department "${department.name}" updated`); // Log the department update

      // Send notifications to users about the updated department
      const allUsers = await User.find().select('_id');
      const userIds = allUsers.map(user => user._id);
      const notificationMessage = `The department "${department.name}" has been updated.`;
      await sendDepartmentNotifications(userIds, notificationMessage, `/departments/${department._id}`, req.user._id);

      res.json(department);
    } else {
      res.status(404).json({ message: 'Department not found' }); // Return the error message
    }
  } catch (error) {
    res.status(500).json({ message: error.message }); // Return the error message
  }
};

// @desc    Delete a department and its sub-departments
// @route   DELETE /api/departments/:id
// @access  Private
const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);

    if (!department) {
      console.error(`Department with ID ${req.params.id} not found`); // Log the error
      return res.status(404).json({ message: 'Department not found' }); // Return the error message
    }

    console.log(`Deleting department: ${department.name}`); // Log the department being deleted

    // Delete all sub-departments recursively
    await deleteSubDepartments(department._id);

    // Optionally, remove users associated with this department
    await User.updateMany({ department: department._id }, { $unset: { department: '' } });

    // Use `findByIdAndDelete` method to delete the department
    await Department.findByIdAndDelete(req.params.id);

    // Send notifications to users about the deleted department
    const allUsers = await User.find().select('_id');
    const userIds = allUsers.map(user => user._id);
    const notificationMessage = `The department "${department.name}" has been deleted.`;
    await sendDepartmentNotifications(userIds, notificationMessage, '/departments', req.user._id);

    res.json({ message: 'Department removed' }); // Return the success message
  } catch (error) {
    console.error(`Error deleting department: ${error.message}`); // Log the error
    res.status(500).json({ message: error.message }); // Return the error message
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
      const members = await User.find({ department: department._id });

      res.json({
        ...department.toObject(),
        subDepartments: subDepartments.length > 0 ? subDepartments : 'No sub-departments found.',
        members: members.length > 0 ? members : 'No members found.',
      });
    } else {
      res.status(404).json({ message: 'Department not found' }); // Return the error message
    }
  } catch (error) {
    res.status(500).json({ message: error.message }); // Return the error message
  }
};

module.exports = {
  getDepartments,
  getTheDepartments,
  addParentDepartment,
  addSubDepartment,
  editDepartment,
  deleteDepartment,
  getDepartmentById,
  getMainDepartmentsOnly,
  getSubDepartmentsOnly,
};
