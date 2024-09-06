const express = require('express');
const {
  createDecisionRoom,
  addProposal,
  castVote,
  getDecisionRooms,
  getDecisionRoomDetails,
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
router.route('/edit/:id').post(protect, updateDecisionRoom);

module.exports = router;
