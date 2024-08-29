const User = require('../models/userModel');

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
    const query = {};

    if (department) {
      query.department = department;
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

module.exports = {
  getUsers,
  getUserById,
  searchUsers,
  getSkills, // Export the getSkills function
};
