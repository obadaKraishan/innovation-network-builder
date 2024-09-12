const express = require('express');
const multer = require('multer');
const {
  submitIdea,
  getIdeaById,
  getAllIdeas,
  approveIdea,
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
} = require('../controllers/innovationController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// Initialize multer for handling multipart/form-data
const upload = multer(); // Using .none() since you're dealing with form fields and potentially files later

// Submit a new innovation idea with form data handling
router.post('/submit-idea', protect, upload.none(), submitIdea);

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
router.get('/allocated-resources/:id', protect, getAllocatedResources);

// Withdraw an idea
router.post('/withdraw-idea/:id', protect, withdrawIdea);

// Feedback routes
router.post('/feedback', protect, addFeedback);
router.get('/feedback/:ideaId', protect, getFeedback);
router.put('/feedback/:feedbackId', protect, updateFeedback);
router.delete('/feedback/:feedbackId', protect, deleteFeedback);

// Voting route
router.post('/idea/:id/vote', protect, submitVote);

module.exports = router;
