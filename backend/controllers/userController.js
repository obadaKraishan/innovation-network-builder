// File: backend/controllers/userController.js

const mongoose = require('mongoose');
const User = require('../models/userModel');
const Department = require('../models/departmentModel');
const Team = require('../models/teamModel');
const bcrypt = require('bcryptjs');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    console.log('Fetching all users');
    const users = await User.find();
    console.log('Users fetched successfully:', users);
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users for message creation
// @route   GET /api/users/message-recipients
// @access  Private
const getUsersForMessageRecipients = async (req, res) => {
  try {
    const users = await User.find().select('name email _id');
    res.json(users);
  } catch (error) {
    console.error('Error fetching users for message recipients:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
const getUserById = async (req, res) => {
  try {
    console.log('Fetching user by ID:', req.params.id);
    const user = await User.findById(req.params.id);
    if (user) {
      console.log('User fetched successfully:', user);
      res.json(user);
    } else {
      console.log('User not found:', req.params.id);
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user by ID:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Search users by department or skills
// @route   GET /api/users/search
// @access  Private
const searchUsers = async (req, res) => {
  const { department, skills } = req.query;

  try {
    console.log('Searching users with department and skills:', { department, skills });
    let departmentIds = [department];

    // If a department is selected, find all sub-departments
    if (department) {
      const subDepartments = await Department.find({ parentDepartment: department }).select('_id');
      departmentIds = departmentIds.concat(subDepartments.map(subDept => subDept._id.toString()));
    }

    // Validate that departmentIds are valid ObjectId instances
    const validDepartmentIds = departmentIds.map(id => {
      return mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : null;
    }).filter(id => id !== null);

    const query = {};

    if (validDepartmentIds.length > 0) {
      query.department = { $in: validDepartmentIds };
    } else {
      console.warn('Invalid department ID:', department);
    }

    if (skills) {
      query.skills = { $in: skills.split(',') };
    }

    console.log('Constructed query:', query);

    const users = await User.find(query).populate('department');
    console.log('Users found:', users);
    res.json(users);
  } catch (error) {
    console.error('Error searching users:', error.message);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

// @desc    Get all unique skills
// @route   GET /api/users/skills
// @access  Private
const getSkills = async (req, res) => {
  try {
    console.log('Fetching all unique skills');
    const users = await User.find();
    const skillsSet = new Set();

    users.forEach(user => {
      user.skills.forEach(skill => skillsSet.add(skill));
    });

    const skillsArray = Array.from(skillsSet);
    console.log('Skills fetched successfully:', skillsArray);
    res.json(skillsArray);
  } catch (error) {
    console.error('Error fetching skills:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user information
// @route   PUT /api/users/:id
// @access  Private
const updateUserInfo = async (req, res) => {
  const { name, skills } = req.body;

  try {
    console.log('Updating user information:', req.params.id);
    const user = await User.findById(req.params.id);

    if (user) {
      user.name = name || user.name;
      user.skills = skills || user.skills;

      const updatedUser = await user.save();
      console.log('User information updated successfully:', updatedUser);
      res.json(updatedUser);
    } else {
      console.log('User not found:', req.params.id);
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error updating user information:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user password
// @route   PUT /api/users/:id/password
// @access  Private
const updateUserPassword = async (req, res) => {
  const { password } = req.body;

  try {
    console.log('Updating user password:', req.params.id);
    const user = await User.findById(req.params.id);

    if (user) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();
      console.log('User password updated successfully');
      res.json({ message: 'Password updated successfully' });
    } else {
      console.log('User not found:', req.params.id);
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error updating user password:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get team members based on the user's department and role
// @route   GET /api/users/my-team
// @access  Private
const getMyTeam = async (req, res) => {
  try {
    console.log('Entering getMyTeam');
    console.log('req.user:', req.user);

    if (!mongoose.Types.ObjectId.isValid(req.user._id)) {
      console.log('Invalid User ObjectId:', req.user._id);
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const user = await User.findById(req.user._id).populate('department');

    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('User found:', user);

    let query = {};

    if (user.role === 'Employee' || user.role === 'Team Leader') {
      console.log('Role is Employee or Team Leader');
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

    // Fetch users based on the query
    const teamMembers = await User.find(query).populate('department');

    // Fetch teams where the user is a member or team leader
    const teams = await Team.find({
      $or: [
        { teamLeader: user._id },
        { members: user._id },
      ]
    }).populate('members teamLeader department');

    if (!teamMembers.length && !teams.length) {
      console.log('No team members or teams found');
      return res.status(404).json({ message: 'No team members or teams found' });
    }

    console.log('Team members found:', teamMembers);
    console.log('Teams found:', teams);
    res.json({ teamMembers, teams });
  } catch (error) {
    console.error('Error in getMyTeam:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// @desc    Get users by department
// @route   GET /api/users/department-users
// @access  Private
const getUsersByDepartment = async (req, res) => {
  try {
    const departmentId = req.query.department; // Get department ID from query parameter

    if (!departmentId) {
      return res.status(400).json({ message: 'Department ID is required' });
    }

    // Validate that departmentId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(departmentId)) {
      return res.status(400).json({ message: 'Invalid Department ID' });
    }

    // Find all sub-departments for the given department
    const subDepartments = await Department.find({ parentDepartment: departmentId }).select('_id');
    const departmentIds = [departmentId, ...subDepartments.map(subDept => subDept._id)];

    // Find users in the main department and all sub-departments
    const users = await User.find({ department: { $in: departmentIds } }).select('name position skills role email');

    if (!users.length) {
      return res.status(404).json({ message: 'No users found in this department or sub-departments' });
    }

    res.json(users);
  } catch (error) {
    console.error('Error fetching users by department:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get users by department for team management
// @route   GET /api/users/department-users-for-teams
// @access  Private
const getUsersByDepartmentForTeams = async (req, res) => {
  try {
    const departmentId = req.user.department; // Get department ID from the authenticated user

    if (!departmentId) {
      console.log('Department ID is missing');
      return res.status(400).json({ message: 'Department ID is required' });
    }

    if (!mongoose.Types.ObjectId.isValid(departmentId)) {
      console.log('Invalid Department ID:', departmentId);
      return res.status(400).json({ message: 'Invalid Department ID' });
    }

    const subDepartments = await Department.find({ parentDepartment: departmentId }).select('_id');
    const departmentIds = [departmentId, ...subDepartments.map(subDept => subDept._id)];

    const users = await User.find({ department: { $in: departmentIds } }).select('name position skills role email');

    if (!users.length) {
      return res.status(404).json({ message: 'No users found in this department or sub-departments' });
    }

    res.json(users);
  } catch (error) {
    console.error('Error fetching users by department for teams:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get users for management based on role
// @route   GET /api/users/manage-users
// @access  Private/CEO or Authorized Roles
const manageUsers = async (req, res) => {
  try {
    const { department, search } = req.query;
    let query = {};

    if (department) {
      const subDepartments = await Department.find({ parentDepartment: department }).select('_id');
      const departmentIds = [department, ...subDepartments.map(subDept => subDept._id)];
      query.department = { $in: departmentIds };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query).populate('department').select('name email position role department');
    res.json(users);
  } catch (error) {
    console.error('Error managing users:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a new user
// @route   POST /api/users
// @access  Private/Admin or CEO
const addUser = async (req, res) => {
  const { name, email, password, role, department, subDepartment, skills, position } = req.body;

  try {
    // Check if user with the same email already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Create a new user
    const user = new User({
      name,
      email,
      password, // The password will be hashed in the pre-save hook in the User model
      role,
      department: subDepartment || department, // Use subDepartment if provided, otherwise department
      skills: skills.split(',').map(skill => skill.trim()), // Convert comma-separated skills string to an array
      position,
    });

    // Save the user to the database
    const createdUser = await user.save();

    res.status(201).json(createdUser);
  } catch (error) {
    console.error('Error adding user:', error.message);
    res.status(500).json({ message: 'Server Error', error: error.message });
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
  getUsersByDepartment,
  getUsersByDepartmentForTeams,
  getUsersForMessageRecipients,
  manageUsers,
  addUser
};
