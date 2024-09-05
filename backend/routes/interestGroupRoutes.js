const express = require('express');
const { protect, allowEmployees } = require('../middleware/authMiddleware');
const {
  createGroup,
  getAllUsersInGroup,
  getGroups,
  getGroupById,
  updateGroup,
  deleteGroup,
  leaveGroup,
  getReceivedInvitations,
  getSentInvitations,
  sendInvitation,
  requestToJoinGroup,
  manageInvitation,
  addInterestGroupComment,
  updateInterestGroupComment,
  deleteInterestGroupComment,
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

// Route to list all users in a specific group (accessible to all employees)
router.route('/:id/users').get(protect, allowEmployees, getAllUsersInGroup);

// Route to send invitations to users
router.route('/:id/invite').post(protect, sendInvitation);

// Route to manage invitations (accept/decline)
router.route('/invitation/:invitationId').put(protect, manageInvitation);

// Routes to fetch received and sent invitations
router.get('/invitations/received', protect, getReceivedInvitations);
router.get('/invitations/sent', protect, getSentInvitations);
router.route('/:id/join').post(protect, requestToJoinGroup);

// Route to leave a group
router.route('/:id/leave').put(protect, leaveGroup);

// Routes for handling comments in interest group discussions
router.post('/:id/comments', protect, addInterestGroupComment); // Add comment/reply
router.put('/:id/comments/:commentId', protect, updateInterestGroupComment); // Update comment
router.delete('/:id/comments/:commentId', protect, deleteInterestGroupComment); // Delete comment

module.exports = router;
