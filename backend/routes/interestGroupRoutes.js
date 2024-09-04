const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  createGroup,
  getGroups,
  getGroupById,
  updateGroup,
  deleteGroup,
  sendInvitation,
  manageInvitation,
} = require('../controllers/interestGroupController');

const router = express.Router();

// Route to create a new group
router.route('/create').post(protect, createGroup);

// Route to fetch all groups
router.route('/').get(protect, getGroups);

// Route to fetch details of a specific group
router.route('/:id').get(protect, getGroupById);

// Route to update group details
router.route('/:id').put(protect, updateGroup);

// Route to delete a group
router.route('/:id').delete(protect, deleteGroup);

// Route to send invitations to users
router.route('/:id/invite').post(protect, sendInvitation);

// Route to manage invitations (accept/decline)
router.route('/invitation/:invitationId').put(protect, manageInvitation);

module.exports = router;
