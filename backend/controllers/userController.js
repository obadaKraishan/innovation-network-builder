const User = require('../models/userModel');
const Department = require('../models/departmentModel');
const bcrypt = require('bcryptjs');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Search users by department or skills
// @route   GET /api/users/search
// @access  Private
const searchUsers = async (req, res) => {
  const { department, skills } = req.query;

  try {
    let departmentIds = [department];

    // If a department is selected, find all sub-departments
    if (department) {
      const subDepartments = await Department.find({ parentDepartment: department }).select('_id');
      departmentIds = departmentIds.concat(subDepartments.map(subDept => subDept._id));
    }

    const query = {};

    if (department) {
      query.department = { $in: departmentIds };
    }

    if (skills) {
      query.skills = { $in: skills.split(',') };
    }

    const users = await User.find(query).populate('department');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all unique skills
// @route   GET /api/users/skills
// @access  Private
const getSkills = async (req, res) => {
  try {
    const users = await User.find();
    const skillsSet = new Set();

    users.forEach(user => {
      user.skills.forEach(skill => skillsSet.add(skill));
    });

    const skillsArray = Array.from(skillsSet);
    res.json(skillsArray);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user information
// @route   PUT /api/users/:id
// @access  Private
const updateUserInfo = async (req, res) => {
  const { name, skills } = req.body;  // Only allow name and skills to be updated

  try {
    const user = await User.findById(req.params.id);

    if (user) {
      user.name = name || user.name;
      user.skills = skills || user.skills;

      const updatedUser = await user.save();
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user password
// @route   PUT /api/users/:id/password
// @access  Private
const updateUserPassword = async (req, res) => {
  const { password } = req.body;

  try {
    const user = await User.findById(req.params.id);

    if (user) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();
      res.json({ message: 'Password updated successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUsers,
  getUserById,
  searchUsers,
  getSkills,
  updateUserInfo,
  updateUserPassword,
};
