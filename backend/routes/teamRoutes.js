const express = require('express');
const {
  createTeam,
  getTeams,
  getTeamById,
  updateTeam,
  addTask,
  addComment,
  updateComment,
  deleteComment,
  updateTaskStatus, // Added the updateTaskStatus route
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
router.put('/:id/comment/:commentId', protect, updateComment);
router.delete('/:id/comment/:commentId', protect, deleteComment);
router.put('/:id/task/:taskId', protect, updateTaskStatus); // Added route for updating task status

module.exports = router;
