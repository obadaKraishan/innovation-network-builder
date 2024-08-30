const Team = require('../models/teamModel');
const User = require('../models/userModel');
const Department = require('../models/departmentModel');

// Create a new team
const createTeam = async (req, res) => {
  try {
    const { name, members, objective, description, tasks } = req.body;
    const teamLeader = req.user._id;
    const department = req.user.department;

    console.log('Creating team with:', { name, members, objective, description, department });

    if (!name || !members || !objective) {
      console.log('Missing required fields:', { name, members, objective });
      return res.status(400).json({ message: 'Name, members, and objective are required' });
    }

    const team = new Team({
      name,
      members,
      teamLeader,
      department,
      objective,
      description,
      tasks,
    });

    await team.save();

    console.log('Team created successfully:', team);
    res.status(201).json(team);
  } catch (error) {
    console.error('Error creating team:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get teams for a department
const getTeams = async (req, res) => {
  try {
    console.log('Fetching teams for user department:', req.user.department);

    // Verify that the department exists in the request
    if (!req.user.department) {
      console.log('No department found in the user data.');
      return res.status(400).json({ message: 'No department assigned to the user' });
    }

    // Check if department exists in the database
    const departmentExists = await Department.findById(req.user.department);
    if (!departmentExists) {
      console.log('Department does not exist in the database:', req.user.department);
      return res.status(404).json({ message: 'Department not found' });
    }

    const teams = await Team.find({ department: req.user.department }).populate('members teamLeader');

    if (!teams.length) {
      console.log('No teams found for department:', req.user.department);
      return res.status(404).json({ message: 'No teams found' });
    }

    console.log('Teams fetched successfully:', teams);
    res.json(teams);
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get a specific team by ID
const getTeamById = async (req, res) => {
  try {
    console.log('Fetching team by ID:', req.params.id);
    const team = await Team.findById(req.params.id).populate('members teamLeader');

    if (!team) {
      console.log('Team not found:', req.params.id);
      return res.status(404).json({ message: 'Team not found' });
    }

    console.log('Team fetched successfully:', team);
    res.json(team);
  } catch (error) {
    console.error('Error fetching team:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Update a team
const updateTeam = async (req, res) => {
  try {
    console.log('Updating team:', req.params.id);
    const { name, members, objective, description, tasks } = req.body;
    const team = await Team.findById(req.params.id);

    if (!team) {
      console.log('Team not found:', req.params.id);
      return res.status(404).json({ message: 'Team not found' });
    }

    team.name = name || team.name;
    team.members = members || team.members;
    team.objective = objective || team.objective;
    team.description = description || team.description;
    team.tasks = tasks || team.tasks;

    await team.save();

    console.log('Team updated successfully:', team);
    res.json(team);
  } catch (error) {
    console.error('Error updating team:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Add a comment to a team's discussion
const addComment = async (req, res) => {
  try {
    console.log('Adding comment to team:', req.params.id);
    const { comment } = req.body;
    const team = await Team.findById(req.params.id);

    if (!team) {
      console.log('Team not found:', req.params.id);
      return res.status(404).json({ message: 'Team not found' });
    }

    team.discussions.push({
      user: req.user._id,
      comment,
      createdAt: new Date(),
    });

    await team.save();

    console.log('Comment added successfully to team:', team);
    res.json(team);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  createTeam,
  getTeams,
  getTeamById,
  updateTeam,
  addComment,
};
