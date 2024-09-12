const asyncHandler = require('express-async-handler');
const { Innovation, feedbackModel } = require('../models/innovationModel');
const ResourceAllocation = require('../models/resourceAllocationModel');
const mongoose = require("mongoose");

// Submit a new innovation idea
const submitIdea = asyncHandler(async (req, res) => {
  console.log('Received form-data:', req.body); // Log the request body

  const {
    title, description, problem, solution, expectedImpact, impactType, department, resources,
    roiEstimate, businessGoalAlignment, riskAssessment, successMetrics, expertiseRequired, externalResources
  } = req.body;

  console.log("Parsed Data:");
  console.log({
    title, description, problem, solution, expectedImpact, impactType, department, resources,
    roiEstimate, businessGoalAlignment, riskAssessment, successMetrics, expertiseRequired, externalResources
  });

  // Ensure department is received as a stringified array
  let departmentArray;
  try {
    console.log('Department before parsing:', department);
    departmentArray = JSON.parse(department);
    console.log('Parsed Department Array:', departmentArray);

    if (!Array.isArray(departmentArray)) {
      throw new Error('Department must be an array.');
    }

    // Convert department IDs to ObjectId using `new` keyword
    departmentArray = departmentArray.map(dept => {
      console.log(`Converting department ID: ${dept}`);
      return new mongoose.Types.ObjectId(dept); // Use `new` keyword with ObjectId
    });
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

// Approve an idea and move it to the next stage
const approveIdea = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const idea = await Innovation.findById(id);

  if (!idea) {
    res.status(404);
    throw new Error('Idea not found');
  }

  idea.stage = 'development';
  idea.approvedBy = req.user._id;
  idea.approvedAt = Date.now();

  const updatedIdea = await idea.save();
  res.json(updatedIdea);
});

// Update the stage of an idea
const updateIdeaStage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { stage } = req.body;

  const idea = await Innovation.findById(id);

  if (!idea) {
    res.status(404);
    throw new Error('Idea not found');
  }

  idea.stage = stage;
  const updatedIdea = await idea.save();
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
  res.json(updatedIdea);
});

// Allocate resources to a project
const allocateResources = asyncHandler(async (req, res) => {
  const { projectId, budget, teamMembers, estimatedCompletionTime } = req.body;

  const allocation = new ResourceAllocation({
    projectId,
    budget,
    teamMembers,
    estimatedCompletionTime,
  });

  const savedAllocation = await allocation.save();
  res.status(201).json(savedAllocation);
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
    await feedback.remove();
    res.json({ message: 'Feedback removed' });
  });

module.exports = {
  submitIdea,
  getIdeaById,
  getAllIdeas,
  approveIdea,
  updateIdeaStage,
  evaluateIdea,
  allocateResources,
  withdrawIdea,
  addFeedback,
  getFeedback,
  updateFeedback,
  deleteFeedback,
};
