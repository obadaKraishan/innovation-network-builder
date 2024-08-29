const mongoose = require('mongoose');
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
      query.department = { $in: departmentIds.map(id => mongoose.Types.ObjectId(id)) };
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

// @desc    Get team members based on the user's department and role
// @route   GET /api/users/my-team
// @access  Private
// @desc    Get team members based on the user's department and role
// @route   GET /api/users/my-team
// @access  Private
const getMyTeam = async (req, res) => {
  try {
    console.log('Entering getMyTeam');
    console.log('req.user:', req.user);

    // Validate req.user._id as a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.user._id)) {
      console.log('Invalid User ObjectId:', req.user._id);
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    // Fetch the user from the database and populate the department
    const user = await User.findById(req.user._id).populate('department');

    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('User found:', user);

    // Initialize the query
    let query = {};

    // Check the user’s role to build the appropriate query
    if (user.role === 'Employee' || user.role === 'Team Leader') {
      console.log('Role is Employee or Team Leader');
      // Check if the department exists and is valid
      if (user.department && mongoose.Types.ObjectId.isValid(user.department._id)) {
        query = { department: user.department._id };
      } else {
        console.log('Invalid or missing department for the user');
        return res.status(400).json({ message: 'Invalid or missing department for the user' });
      }
    } else if (user.role === 'Department Manager') {
      console.log('Role is Department Manager');
      if (user.department && mongoose.Types.ObjectId.isValid(user.department._id)) {
        const subDepartments = await Department.find({ parentDepartment: user.department._id }).select('_id');
        query = { department: { $in: [user.department._id, ...subDepartments.map(subDept => subDept._id)] } };
      } else {
        console.log('Invalid or missing department for the user');
        return res.status(400).json({ message: 'Invalid or missing department for the user' });
      }
    } else {
      console.log('Not authorized to view team');
      return res.status(403).json({ message: 'Not authorized to view team' });
    }

    console.log('Final query before DB operation:', query);

    // Perform the query to find team members
    const teamMembers = await User.find(query).populate('department');

    if (!teamMembers.length) {
      console.log('No team members found');
      return res.status(404).json({ message: 'No team members found' });
    }

    console.log('Team members found:', teamMembers);
    res.json(teamMembers);
  } catch (error) {
    console.error('Error in getMyTeam:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


module.exports = {
  getUsers,
  getUserById,
  searchUsers,
  getSkills,
  updateUserInfo,
  updateUserPassword,
  getMyTeam,
};
