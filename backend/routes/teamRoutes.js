// File: backend/routes/teamRoutes.js

const express = require('express');
const { createTeam, getTeams, getTeamById, updateTeam, addComment } = require('../controllers/teamController');
const { protect } = require('../middleware/authMiddleware'); // Correct import of protect middleware

const router = express.Router();

// Routes for managing teams
router.post('/create', protect, createTeam);
router.get('/', protect, getTeams);
router.get('/:id', protect, getTeamById);
router.put('/:id', protect, updateTeam);
router.post('/:id/comment', protect, addComment);

module.exports = router;
