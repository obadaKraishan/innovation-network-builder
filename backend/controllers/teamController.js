const Team = require('../models/teamModel');
const User = require('../models/userModel');
const Department = require('../models/departmentModel');

// Create a new team
exports.createTeam = async (req, res) => {
  try {
    const { name, members, objective, description, tasks } = req.body;
    const teamLeader = req.user._id;
    const department = req.user.department;

    if (!name || !members || !objective) {
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

    res.status(201).json(team);
  } catch (error) {
    console.error('Error creating team:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get teams for a department
exports.getTeams = async (req, res) => {
  try {
    const teams = await Team.find({ department: req.user.department }).populate('members teamLeader');

    if (!teams.length) {
      return res.status(404).json({ message: 'No teams found' });
    }

    res.json(teams);
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get a specific team by ID
exports.getTeamById = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id).populate('members teamLeader');

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    res.json(team);
  } catch (error) {
    console.error('Error fetching team:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Update a team
exports.updateTeam = async (req, res) => {
  try {
    const { name, members, objective, description, tasks } = req.body;
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    team.name = name || team.name;
    team.members = members || team.members;
    team.objective = objective || team.objective;
    team.description = description || team.description;
    team.tasks = tasks || team.tasks;

    await team.save();

    res.json(team);
  } catch (error) {
    console.error('Error updating team:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Add a comment to a team's discussion
exports.addComment = async (req, res) => {
  try {
    const { comment } = req.body;
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    team.discussions.push({
      user: req.user._id,
      comment,
      createdAt: new Date(),
    });

    await team.save();

    res.json(team);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
