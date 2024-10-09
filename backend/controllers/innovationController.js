const { sendNotification } = require('../services/notificationService');
const { Innovation } = require('../models/innovationModel');
const Connection = require('../models/connectionModel');
const Notification = require('../models/notificationModel');
const mongoose = require("mongoose");
const asyncHandler = require('express-async-handler');


// Utility function to create a new connection between two users
const createConnection = async (userA, userB, context) => {
  try {
    console.log(`Attempting to create connection between ${userA} and ${userB} with context: ${context}`);

    const newConnection = new Connection({
      userA,
      userB,
      context,
      interactionCount: 1,
      lastInteractedAt: Date.now(),
    });

    const savedConnection = await newConnection.save();
    console.log(`Connection successfully created:`, savedConnection);

    return savedConnection;
  } catch (error) {
    console.error(`Error creating connection between ${userA} and ${userB} for context: ${context}:`, error.message);
  }
};


// Submit a new innovation idea
const submitIdea = asyncHandler(async (req, res) => {
  console.log('Received form-data:', req.body); // Log the request body

  const {
    title, description, problem, solution, expectedImpact, impactType, department, resources,
    roiEstimate, businessGoalAlignment, riskAssessment, successMetrics, expertiseRequired, externalResources
  } = req.body;

  // Ensure department is received as a stringified array
  let departmentArray;
  try {
    console.log('Department before parsing:', department);
    departmentArray = JSON.parse(department);
    console.log('Parsed Department Array:', departmentArray);

    if (!Array.isArray(departmentArray)) {
      throw new Error('Department must be an array.');
    }

    departmentArray = departmentArray.map(dept => new mongoose.Types.ObjectId(dept));
  } catch (error) {
    console.error("Department conversion error: ", error.message);
    return res.status(400).json({ message: 'Invalid department data format.' });
  }

  // Parse resources
  let parsedResources;
  try {
    parsedResources = JSON.parse(resources);
    console.log("Resources parsed successfully");
  } catch (error) {
    console.error("Resource parsing error: ", error.message);
    return res.status(400).json({ message: 'Invalid resources data format.' });
  }

  // Create a new innovation document
  try {
    const idea = new Innovation({
      ideaId: `ID-${Date.now()}`,
      title,
      description,
      problem,
      solution,
      expectedImpact,
      impactType,
      employeeId: req.user._id,
      department: departmentArray,
      resources: parsedResources,
      roiEstimate: roiEstimate || 0,
      businessGoalAlignment,
      riskAssessment,
      successMetrics,
      expertiseRequired,
      externalResources,
    });

    const savedIdea = await idea.save();
    console.log("Idea saved successfully");

    // Fetch the relevant department heads (managers) to notify
    const departmentHeads = await User.find({ role: 'Department Head', department: { $in: departmentArray } });

    for (const head of departmentHeads) {
      // Create connection between employee and department head
      const savedConnection = await createConnection(req.user._id, head._id, 'innovation idea');
      console.log('Saved Connection with Department Head:', savedConnection);

      // Create and save notification for department heads
      const notificationMessage = `New innovation idea from ${req.user.name}: "${title}"`;
      const newNotification = new Notification({
        recipient: head._id,
        sender: req.user._id,
        message: notificationMessage,
        type: 'info',
        link: `/ideas/${savedIdea._id}`,  // Link to the idea details
      });

      await newNotification.save();

      // Send real-time notification to department heads
      sendNotification(head._id, newNotification);
    }

    return res.status(201).json(savedIdea);
  } catch (error) {
    console.error("Error saving idea: ", error.message);
    return res.status(500).json({ message: 'Server error saving the idea', error: error.message });
  }
});

// Get details of a specific idea by ID
const getIdeaById = asyncHandler(async (req, res) => {
  const idea = await Innovation.findById(req.params.id)
    .populate('employeeId', 'name')
    .populate('department', 'name');

  if (!idea) {
    res.status(404);
    throw new Error('Idea not found');
  }

  res.json(idea);
});

// Get all ideas (supports filtering by department, stage, priority)
const getAllIdeas = asyncHandler(async (req, res) => {
  const { department, stage, priority } = req.query;
  const query = {};

  if (department) query.department = department;
  if (stage) query.stage = stage;
  if (priority) query.priority = { $gte: priority };

  const ideas = await Innovation.find(query)
    .populate('employeeId', 'name')
    .populate('department', 'name'); // Populate department names

  res.json(ideas);
});

// Update the stage of an idea (replacing approveIdea functionality)
const updateIdeaStage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { stage } = req.body;

  const idea = await Innovation.findById(id);

  if (!idea) {
    res.status(404);
    throw new Error('Idea not found');
  }

  console.log(`Updating idea stage from ${idea.stage} to ${stage}`);

  if (stage === 'completed') {
    idea.implementedAt = new Date(); // Mark implementation date when the idea is completed
  }

  idea.stage = stage;
  const updatedIdea = await idea.save();

  // Send notification to idea owner
  const notificationMessage = `Your idea "${idea.title}" has moved to the "${stage}" stage.`;
  const newNotification = new Notification({
    recipient: idea.employeeId,
    sender: req.user._id,
    message: notificationMessage,
    type: 'info',
    link: `/ideas/${idea._id}`,  // Link to the idea
  });

  await newNotification.save();
  sendNotification(idea.employeeId, newNotification);

  res.json(updatedIdea);
});

// Evaluate an idea (impact, feasibility, cost, alignment)
const evaluateIdea = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { impactScore, feasibilityScore, costScore, alignmentScore } = req.body;

  const idea = await Innovation.findById(id);

  if (!idea) {
    res.status(404);
    throw new Error('Idea not found');
  }

  idea.impactScore = impactScore;
  idea.feasibilityScore = feasibilityScore;
  idea.costScore = costScore;
  idea.alignmentScore = alignmentScore;
  idea.priority = impactScore + feasibilityScore + costScore + alignmentScore;

  const updatedIdea = await idea.save();

  // Send notification to the idea owner
  const notificationMessage = `Your idea "${idea.title}" has been evaluated.`;
  const newNotification = new Notification({
    recipient: idea.employeeId,
    sender: req.user._id,
    message: notificationMessage,
    type: 'info',
    link: `/ideas/${idea._id}`,
  });

  await newNotification.save();
  sendNotification(idea.employeeId, newNotification);

  res.json(updatedIdea);
});

// Allocate resources to a project
const allocateResources = asyncHandler(async (req, res) => {
  const { projectId, budget, time, manpower, teamMembers, estimatedCompletionTime } = req.body;

  const allocation = new ResourceAllocation({
    projectId,
    budget,
    resourcesUsed: {
      budget,
      time,
      manpower,
    },
    teamMembers,
    estimatedCompletionTime,
  });

  const savedAllocation = await allocation.save();
  res.status(201).json(savedAllocation);
});

// Get allocated resources for a specific project by projectId
const getAllocatedResources = asyncHandler(async (req, res) => {
    const resources = await ResourceAllocation.find({ projectId: req.params.id })
      .populate('teamMembers', 'name'); // Populate team members' names
  
    if (!resources) {
      res.status(404);
      throw new Error('No resources found for this project');
    }
  
    res.json(resources);
  });  

// Withdraw an idea (idea owner only)
const withdrawIdea = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const idea = await Innovation.findById(id);
  
    if (!idea) {
      res.status(404);
      throw new Error('Idea not found');
    }
  
    // Ensure only the idea owner can withdraw the idea
    if (idea.employeeId.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('You do not have permission to withdraw this idea');
    }
  
    // Mark idea as withdrawn
    idea.stage = 'withdrawn';
    await idea.save();
    res.json({ message: 'Idea withdrawn successfully' });
  });


// Add feedback
const addFeedback = asyncHandler(async (req, res) => {
  const { comment, parent, ideaId } = req.body;
  const feedback = new feedbackModel({
    user: req.user._id,
    comment,
    parent,
    ideaId,
  });

  const savedFeedback = await feedback.save();

  // Send notification to the idea owner
  const idea = await Innovation.findById(ideaId);
  if (idea) {
    const notificationMessage = `${req.user.name} added feedback to your idea "${idea.title}".`;
    const newNotification = new Notification({
      recipient: idea.employeeId,
      sender: req.user._id,
      message: notificationMessage,
      type: 'info',
      link: `/ideas/${ideaId}`,
    });

    await newNotification.save();
    sendNotification(idea.employeeId, newNotification);
  }

  res.status(201).json(savedFeedback);
});
  
// Get feedback for idea
const getFeedback = asyncHandler(async (req, res) => {
  const { ideaId } = req.params;
  const feedback = await feedbackModel.find({ ideaId }).populate('user', 'name');
  res.json(feedback);
});

// Edit feedback
const updateFeedback = asyncHandler(async (req, res) => {
  const feedback = await feedbackModel.findById(req.params.feedbackId);
  if (!feedback) {
    res.status(404);
    throw new Error('Feedback not found');
  }
  if (feedback.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to edit this feedback');
  }

  feedback.comment = req.body.comment;
  await feedback.save();

  // Send notification to the idea owner
  const idea = await Innovation.findById(feedback.ideaId);
  if (idea) {
    const notificationMessage = `${req.user.name} updated their feedback on your idea "${idea.title}".`;
    const newNotification = new Notification({
      recipient: idea.employeeId,
      sender: req.user._id,
      message: notificationMessage,
      type: 'info',
      link: `/ideas/${feedback.ideaId}`,
    });

    await newNotification.save();
    sendNotification(idea.employeeId, newNotification);
  }

  res.json(feedback);
});
  
// Delete feedback
const deleteFeedback = asyncHandler(async (req, res) => {
    const feedback = await feedbackModel.findById(req.params.feedbackId);
    if (!feedback) {
      res.status(404);
      throw new Error('Feedback not found');
    }
    if (feedback.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to delete this feedback');
    }
  
    // Using deleteOne instead of remove
    await feedbackModel.deleteOne({ _id: req.params.feedbackId });
    res.json({ message: 'Feedback removed successfully' });
  });  


// Vote
const submitVote = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { impact, feasibility, cost, alignment } = req.body;

  const idea = await Innovation.findById(id);

  if (!idea) {
    console.error(`Idea with ID ${id} not found`);
    res.status(404).json({ message: 'Idea not found' });
    return;
  }

  const eligibleRoles = ["CEO", "CTO", "Executive", "Team Leader", "Product Manager"];
  if (!eligibleRoles.includes(req.user.role)) {
    res.status(403);
    throw new Error('You are not authorized to vote');
  }

  if (idea.voters.includes(req.user._id)) {
    res.status(400);
    throw new Error('You have already voted');
  }

  idea.impactVotes.push(impact);
  idea.feasibilityVotes.push(feasibility);
  idea.costVotes.push(cost);
  idea.alignmentVotes.push(alignment);
  idea.voters.push(req.user._id);

  const calcAverage = (votes) => votes.reduce((sum, v) => sum + v, 0) / votes.length;
  idea.impactScore = calcAverage(idea.impactVotes);
  idea.feasibilityScore = calcAverage(idea.feasibilityVotes);
  idea.costScore = calcAverage(idea.costVotes);
  idea.alignmentScore = calcAverage(idea.alignmentVotes);

  await idea.save();

  // Send notification to the idea owner
  const notificationMessage = `${req.user.name} voted on your idea "${idea.title}".`;
  const newNotification = new Notification({
    recipient: idea.employeeId,
    sender: req.user._id,
    message: notificationMessage,
    type: 'info',
    link: `/ideas/${idea._id}`,
  });

  await newNotification.save();
  sendNotification(idea.employeeId, newNotification);

  res.json({
    impactScore: idea.impactScore,
    feasibilityScore: idea.feasibilityScore,
    costScore: idea.costScore,
    alignmentScore: idea.alignmentScore,
  });
});
  

module.exports = {
  submitIdea,
  getIdeaById,
  getAllIdeas,
  updateIdeaStage,
  evaluateIdea,
  allocateResources,
  getAllocatedResources,
  withdrawIdea,
  addFeedback,
  getFeedback,
  updateFeedback,
  deleteFeedback,
  submitVote,
};
