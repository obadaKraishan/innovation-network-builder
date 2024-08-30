const Team = require('../models/teamModel');
const Task = require('../models/taskModel');
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

    if (!req.user.department) {
      console.log('No department found in the user data.');
      return res.status(400).json({ message: 'No department assigned to the user' });
    }

    const departmentExists = await Department.findById(req.user.department);
    if (!departmentExists) {
      console.log('Department does not exist in the database:', req.user.department);
      return res.status(404).json({ message: 'Department not found' });
    }

    const teams = await Team.find({ department: req.user.department }).populate('members teamLeader');

    if (!teams.length) {
      console.log('No teams found for department:', req.user.department);
      return res.json([]); // Return an empty array instead of an error when no teams are found
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
    const team = await Team.findById(req.params.id)
      .populate('members teamLeader')
      .populate({
        path: 'tasks',
        populate: { path: 'assignedTo', select: 'name' },
      })
      .populate({
        path: 'discussions.user', // Populate user in discussions
        select: 'name',
      });

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

// Add a task to a team
const addTask = async (req, res) => {
  try {
    console.log('Adding task to team:', req.params.id);
    const { description, assignedTo, deadline } = req.body;

    if (!description || !assignedTo || !deadline) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    const task = new Task({
      description,
      assignedTo,
      deadline,
    });

    await task.save();

    team.tasks.push(task._id);
    await team.save();

    res.status(201).json(task);
  } catch (error) {
    console.error('Error adding task:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Add a comment to a team's discussion or reply to an existing comment
const addComment = async (req, res) => {
  try {
    console.log('Adding comment to team:', req.params.id);
    const { comment, parent } = req.body;
    const team = await Team.findById(req.params.id);

    if (!team) {
      console.log('Team not found:', req.params.id);
      return res.status(404).json({ message: 'Team not found' });
    }

    const discussion = {
      user: req.user._id,
      comment,
      parent: parent || null,
      createdAt: new Date(),
    };

    team.discussions.push(discussion);
    await team.save();

    console.log('Comment added successfully to team:', team);
    res.json(team);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Update a comment in a team's discussion
const updateComment = async (req, res) => {
  try {
    console.log('Updating comment in team:', req.params.id);
    const { comment } = req.body;
    const team = await Team.findById(req.params.id);

    if (!team) {
      console.log('Team not found:', req.params.id);
      return res.status(404).json({ message: 'Team not found' });
    }

    const discussion = team.discussions.id(req.params.commentId);
    if (!discussion) {
      console.log('Comment not found:', req.params.commentId);
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (discussion.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this comment' });
    }

    discussion.comment = comment;
    await team.save();

    console.log('Comment updated successfully:', discussion);
    res.json(discussion);
  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Delete a comment from a team's discussion
// Delete a comment from a team's discussion
const deleteComment = async (req, res) => {
  try {
    console.log('Deleting comment from team:', req.params.id);
    const team = await Team.findById(req.params.id);

    if (!team) {
      console.log('Team not found:', req.params.id);
      return res.status(404).json({ message: 'Team not found' });
    }

    const discussion = team.discussions.id(req.params.commentId);
    if (!discussion) {
      console.log('Comment not found:', req.params.commentId);
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (discussion.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    // Remove the subdocument from the array
    discussion.remove();
    await team.save();

    console.log('Comment deleted successfully');
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  createTeam,
  getTeams,
  getTeamById,
  updateTeam,
  addTask,
  addComment,
  updateComment,
  deleteComment,
};
