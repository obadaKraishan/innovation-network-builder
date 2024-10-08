const Team = require('../models/teamModel');
const Task = require('../models/taskModel');
const User = require('../models/userModel');
const Department = require('../models/departmentModel');
const Connection = require('../models/connectionModel');
const Notification = require('../models/notificationModel');
const { sendNotification } = require('../services/notificationService');

// Utility function to create a new connection between two users
const createConnection = async (userA, userB, context) => {
  try {
    console.log(`Creating connection between ${userA} and ${userB} with context: ${context}`);

    const connection = new Connection({
      userA,
      userB,
      context,
      connectionType: context === 'team' ? 'Strong Tie' : 'Weak Tie',
      interactionCount: 1,
      lastInteractedAt: Date.now(),
    });

    await connection.save();
    console.log(`Connection created between ${userA} and ${userB} for context: ${context}`);
  } catch (error) {
    console.error(`Error creating connection between ${userA} and ${userB} for context: ${context}:`, error.message);
  }
};

// Utility function to create connections between team members
const updateTeamConnections = async (team) => {
  const { members, teamLeader } = team;

  console.log(`Updating team connections for team leader ${teamLeader} and members`);

  // Create connections between the team leader and each member
  for (let member of members) {
    await createConnection(teamLeader, member, 'team');
  }

  // Create connections among the team members themselves
  for (let i = 0; i < members.length; i++) {
    for (let j = i + 1; j < members.length; j++) {
      const userA = members[i];
      const userB = members[j];
      await createConnection(userA, userB, 'team');
    }
  }
  console.log(`Team connections updated for ${team.name}`);
};

// Utility function to create connections between discussion participants
const updateDiscussionConnections = async (team, commenterId, parentCommentId) => {
  try {
    const participants = new Set();
    participants.add(commenterId.toString());

    console.log(`Updating discussion connections for commenter ${commenterId}`);

    // Collect all participants in the discussion
    team.discussions.forEach(discussion => {
      if (discussion._id.toString() === parentCommentId?.toString()) {
        participants.add(discussion.user.toString()); // Add the parent comment author
      }
      participants.add(discussion.user.toString()); // Add all users who commented
    });

    const participantsArray = Array.from(participants);

    for (let i = 0; i < participantsArray.length; i++) {
      for (let j = i + 1; j < participantsArray.length; j++) {
        const userA = participantsArray[i];
        const userB = participantsArray[j];
        await createConnection(userA, userB, 'discussion');
      }
    }
    console.log(`Discussion connections updated for team ${team.name}`);
  } catch (error) {
    console.error('Error updating discussion connections:', error.message);
  }
};

// Utility function to send notifications to team members
const sendTeamNotifications = async (team, message, link) => {
  try {
    for (const member of team.members) {
      const notificationMessage = message;
      const newNotification = new Notification({
        recipient: member,
        sender: team.teamLeader,
        message: notificationMessage,
        type: 'info',
        link,
      });
      await newNotification.save();
      sendNotification(member, newNotification); // Send real-time notification
    }
  } catch (error) {
    console.error('Error sending team notifications:', error.message);
  }
};

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

    // Create connections for the team members
    await updateTeamConnections(team);

    // Notify members of the new team creation
    const notificationMessage = `You have been added to a new team: ${team.name}`;
    await sendTeamNotifications(team, notificationMessage, `/teams/${team._id}`);

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

    // Update connections for the team members
    await updateTeamConnections(team);

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

    // Create a new connection for task assignment
    await createConnection(req.user._id, assignedTo, 'task assign');

    // Notify the assigned user
    const notificationMessage = `You have been assigned a new task in team: ${team.name}`;
    const newNotification = new Notification({
      recipient: assignedTo,
      sender: req.user._id,
      message: notificationMessage,
      type: 'info',
      link: `/tasks/${task._id}`,
    });
    await newNotification.save();
    sendNotification(assignedTo, newNotification); // Send real-time notification

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

    // Create connections between the commenter and other participants in the discussion
    await updateDiscussionConnections(team, req.user._id, parent);

    // Notify team members of a new comment
    const notificationMessage = `New comment added in the team discussion: ${team.name}`;
    await sendTeamNotifications(team, notificationMessage, `/teams/${team._id}/discussions`);

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

    // Correctly remove the subdocument from the array using `pull`
    team.discussions.pull(discussion._id);
    await team.save();

    console.log('Comment deleted successfully');
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Update task status
const updateTaskStatus = async (req, res) => {
  try {
    console.log('Updating task status:', req.params.taskId);
    const task = await Task.findById(req.params.taskId);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    task.status = req.body.status || task.status;

    await task.save();

    // Create a new connection for task status update
    const team = await Team.findById(req.params.id).populate('teamLeader');
    await createConnection(req.user._id, team.teamLeader._id, 'task status update');

    // Notify the team leader of the task status update
    const notificationMessage = `Task status updated for task: ${task.description}`;
    const newNotification = new Notification({
      recipient: team.teamLeader._id,
      sender: req.user._id,
      message: notificationMessage,
      type: 'info',
      link: `/tasks/${task._id}`,
    });
    await newNotification.save();
    sendNotification(team.teamLeader._id, newNotification); // Send real-time notification

    console.log('Task status updated successfully:', task);
    res.json(task);
  } catch (error) {
    console.error('Error updating task status:', error);
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
  updateTaskStatus,
};
