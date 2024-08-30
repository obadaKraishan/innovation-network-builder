const express = require('express');
const {
  createTeam,
  getTeams,
  getTeamById,
  updateTeam,
  addTask,
  addComment,
  updateComment,
  deleteComment,  // Added new routes for comment updates and deletions
} = require('../controllers/teamController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Routes for managing teams
router.post('/create', protect, (req, res, next) => {
  console.log('Create Team route hit');
  next();
}, createTeam);

router.get('/', protect, (req, res, next) => {
  console.log('Get Teams route hit');
  next();
}, getTeams);

router.get('/:id', protect, (req, res, next) => {
  console.log('Get Team by ID route hit');
  next();
}, getTeamById);

router.put('/:id', protect, (req, res, next) => {
  console.log('Update Team route hit');
  next();
}, updateTeam);

router.post('/:id/task', protect, addTask);

router.post('/:id/comment', protect, addComment);
router.put('/:id/comment/:commentId', protect, updateComment);  // New route for updating comments
router.delete('/:id/comment/:commentId', protect, deleteComment); // New route for deleting comments

module.exports = router;
