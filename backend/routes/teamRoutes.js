const express = require('express');
const { createTeam, getTeams, getTeamById, updateTeam, addComment } = require('../controllers/teamController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Routes for managing teams
router.post('/create', authMiddleware, createTeam);
router.get('/', authMiddleware, getTeams);
router.get('/:id', authMiddleware, getTeamById);
router.put('/:id', authMiddleware, updateTeam);
router.post('/:id/comment', authMiddleware, addComment);

module.exports = router;
