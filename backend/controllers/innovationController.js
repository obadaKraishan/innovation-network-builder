const asyncHandler = require('express-async-handler');
const Innovation = require('../models/innovationModel');
const ResourceAllocation = require('../models/resourceAllocationModel');

// Submit a new innovation idea
const submitIdea = asyncHandler(async (req, res) => {
    console.log(req.body);
  const {
    title, description, problem, solution, expectedImpact, impactType, department, resources,
    roiEstimate, businessGoalAlignment, riskAssessment, successMetrics, expertiseRequired, externalResources
  } = req.body;
  const employeeId = req.user._id;

  const idea = new Innovation({
    ideaId: `ID-${Date.now()}`,
    title,
    description,
    problem,
    solution,
    expectedImpact,
    impactType,
    employeeId,
    department,
    resources,
    roiEstimate,
    businessGoalAlignment,
    riskAssessment,
    successMetrics,
    expertiseRequired,
    externalResources,
  });

  const savedIdea = await idea.save();
  res.status(201).json(savedIdea);
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
    .populate('department', 'name');

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

module.exports = {
  submitIdea,
  getIdeaById,
  getAllIdeas,
  approveIdea,
  updateIdeaStage,
  evaluateIdea,
  allocateResources,
  withdrawIdea,
};
