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

// Route to send invitations to users
router.route('/:id/invite').post(protect, sendInvitation);

// Route to manage invitations (accept/decline)
router.route('/invitation/:invitationId').put(protect, manageInvitation);

// Routes for handling comments in interest group discussions
router.post('/:id/comments', protect, addInterestGroupComment);          // Route to add a comment/reply
router.put('/:id/comments/:commentId', protect, updateInterestGroupComment); // Route to update a comment
router.delete('/:id/comments/:commentId', protect, deleteInterestGroupComment); // Route to delete a comment

module.exports = router;
