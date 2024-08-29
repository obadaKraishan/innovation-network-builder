const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware');
const { getUsers, getUserById } = require('../controllers/userController');

const router = express.Router();

router.route('/').get(protect, admin, getUsers);
router.route('/:id').get(protect, getUserById);

module.exports = router;
