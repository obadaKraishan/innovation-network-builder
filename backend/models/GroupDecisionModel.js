const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  votedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  voteValue: {
    type: String,
    required: true,  // Depending on voting type, this could be 'approve/reject', ranking, or rating
  },
  comment: String,  // Optional comment with the vote
}, { timestamps: true });

const discussionSchema = new mongoose.Schema({
    messageText: {
      type: String,
      required: true,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Discussion',  // This allows us to reference the parent message
      default: null,  // If null, it's a top-level message
    },
    attachments: [String],  // Optional array of attachments (e.g., file URLs)
  }, { timestamps: true });  

const proposalSchema = new mongoose.Schema({
  proposalTitle: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  proposalDescription: {
    type: String,
    required: true,
  },
  votes: [voteSchema],  // Votes for the proposal
  discussion: [discussionSchema],  // Discussion related to the proposal
}, { timestamps: true });

const decisionRoomSchema = new mongoose.Schema({
  decisionRoomName: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  proposals: [proposalSchema],  // Proposals in the decision room
  isPrivate: {
    type: Boolean,
    default: false,
  },
  votingType: {
    type: String,
    enum: ['approval', 'ranking', 'rating'],
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'archived'],
    default: 'active',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('DecisionRoom', decisionRoomSchema);
