const express = require('express');
const {
  createDecisionRoom,
  addProposal,
  addDiscussionMessage,
  castVote,
  getDecisionRooms,
  getDecisionRoomDetails,
  getProposalDetails,
  getProposalDiscussion,
  updateDiscussionMessage,
  deleteDiscussionMessage,
  archiveDecisionRoom,
  updateDecisionRoom,
} = require('../controllers/GroupDecisionController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').post(protect, createDecisionRoom).get(protect, getDecisionRooms);
router.route('/:id').get(protect, getDecisionRoomDetails);
router.route('/add-proposal').post(protect, addProposal);
router.route('/cast-vote').post(protect, castVote);
router.route('/archive/:id').post(protect, archiveDecisionRoom);
router.route('/:id/proposal/:proposalId').get(protect, getProposalDetails);
router.route('/:id/proposal/:proposalId/discussion')
  .get(protect, getProposalDiscussion) // Ensure GET request works
  .post(protect, addDiscussionMessage); // Add the POST request route
router.route('/:id/proposal/:proposalId/discussion/:messageId')
  .put(protect, updateDiscussionMessage)
  .delete(protect, deleteDiscussionMessage);
router.route('/edit/:id').post(protect, updateDecisionRoom);

module.exports = router;
