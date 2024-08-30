const express = require('express');
const {
  createTeam,
  getTeams,
  getTeamById,
  updateTeam,
  addTask,      // Added new route for adding tasks
  addComment,
} = require('../controllers/teamController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Routes for managing teams
router.post('/create', protect, (req, res, next) => {
  console.log('Create Team route hit'); // Add this log for debugging
  next();
}, createTeam);

router.get('/', protect, (req, res, next) => {
  console.log('Get Teams route hit'); // Add this log for debugging
  next();
}, getTeams);

router.get('/:id', protect, (req, res, next) => {
  console.log('Get Team by ID route hit'); // Add this log for debugging
  next();
}, getTeamById);

router.put('/:id', protect, (req, res, next) => {
  console.log('Update Team route hit'); // Add this log for debugging
  next();
}, updateTeam);

router.post('/:id/task', protect, addTask);       // Added new route for adding tasks
router.post('/:id/comment', protect, addComment); // Existing route for adding comments

module.exports = router;
