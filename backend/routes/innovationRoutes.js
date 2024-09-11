const express = require('express');
const {
  submitIdea,
  getIdeaById,
  getAllIdeas,
  approveIdea,
  updateIdeaStage,
  evaluateIdea,
  allocateResources,
} = require('../controllers/innovationController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// Submit a new innovation idea
router.post('/submit-idea', protect, submitIdea);

// Retrieve all ideas (with filtering support)
router.get('/ideas', protect, getAllIdeas);

// Retrieve a specific idea by ID
router.get('/idea/:id', protect, getIdeaById);

// Approve an idea (only for admins)
router.post('/approve-idea/:id', protect, admin, approveIdea);

// Update the stage of an idea
router.post('/update-idea-stage/:id', protect, admin, updateIdeaStage);

// Evaluate an idea
router.post('/evaluate-idea/:id', protect, admin, evaluateIdea);

// Allocate resources for a project
router.post('/allocate-resources', protect, admin, allocateResources);

module.exports = router;
