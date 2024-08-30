const express = require('express');
const {
  createTeam,
  getTeams,
  getTeamById,
  updateTeam,
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

router.post('/:id/comment', protect, (req, res, next) => {
  console.log('Add Comment route hit'); // Add this log for debugging
  next();
}, addComment);

module.exports = router;
