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
router.post('/create', protect, createTeam);
router.get('/', protect, getTeams); // This is the GET /teams route
router.get('/:id', protect, getTeamById);
router.put('/:id', protect, updateTeam);
router.post('/:id/comment', protect, addComment);

module.exports = router;
