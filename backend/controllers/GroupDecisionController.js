const DecisionRoom = require('../models/GroupDecisionModel');
const asyncHandler = require('express-async-handler');

// Create a new decision room
const createDecisionRoom = asyncHandler(async (req, res) => {
  const { decisionRoomName, isPrivate, votingType, members } = req.body;

  const room = await DecisionRoom.create({
    decisionRoomName,
    createdBy: req.user._id,
    isPrivate,
    votingType,
    members,
  });

  res.status(201).json(room);
});

// Add a proposal to a decision room
const addProposal = asyncHandler(async (req, res) => {
  const { roomId, proposalTitle, proposalDescription } = req.body;

  const room = await DecisionRoom.findById(roomId);
  if (!room) {
    res.status(404);
    throw new Error('Decision room not found');
  }

  const proposal = {
    proposalTitle,
    proposalDescription,
    createdBy: req.user._id,
  };

  room.proposals.push(proposal);
  await room.save();

  res.status(201).json(room);
});

// Add a discussion message to a proposal
const addDiscussionMessage = asyncHandler(async (req, res) => {
    const { id, proposalId } = req.params;
    const { messageText, parent = null } = req.body;
  
    const room = await DecisionRoom.findById(id);
    if (!room) {
      res.status(404);
      throw new Error('Decision room not found');
    }
  
    const proposal = room.proposals.id(proposalId);
    if (!proposal) {
      res.status(404);
      throw new Error('Proposal not found');
    }
  
    const newMessage = {
      messageText,
      postedBy: req.user._id,
      parent,
    };
  
    proposal.discussion.push(newMessage);
    await room.save();
  
    // Populate `postedBy` for the newly added message
    await proposal.populate('discussion.postedBy', 'name');
  
    res.status(201).json(proposal.discussion);
  });

// Cast a vote on a proposal
const castVote = asyncHandler(async (req, res) => {
  const { roomId, proposalId, voteValue, comment } = req.body;

  const room = await DecisionRoom.findById(roomId);
  if (!room) {
    res.status(404);
    throw new Error('Decision room not found');
  }

  const proposal = room.proposals.id(proposalId);
  if (!proposal) {
    res.status(404);
    throw new Error('Proposal not found');
  }

  const vote = {
    votedBy: req.user._id,
    voteValue,
    comment,
  };

  proposal.votes.push(vote);
  await room.save();

  res.status(201).json(proposal);
});

// Get all decision rooms for the current user
const getDecisionRooms = asyncHandler(async (req, res) => {
  const rooms = await DecisionRoom.find({
    members: req.user._id,
  });

  res.json(rooms);
});

// Get details of a specific decision room
const getDecisionRoomDetails = asyncHandler(async (req, res) => {
    try {
      const room = await DecisionRoom.findById(req.params.id)
        .populate('createdBy')
        .populate('members', 'name')  // Populate the 'members' field with their names
        .populate('proposals.createdBy')
        .populate('proposals.votes.votedBy')
        .populate('proposals.discussion.postedBy');
    
      if (!room) {
        console.error('Decision room not found:', req.params.id);
        return res.status(404).json({ message: 'Decision room not found' });
      }
  
      if (!room.createdBy || !room.createdBy._id) {
        console.error('Room creator information is missing');
        return res.status(500).json({ message: 'Room creator information is missing' });
      }
  
      console.log('Fetched room details:', room);
      res.json(room);
    } catch (error) {
      console.error('Error fetching room details:', error.message);
      res.status(500).json({ message: 'Server error while fetching room details' });
    }
});

// Get proposal details by roomId and proposalId
const getProposalDetails = asyncHandler(async (req, res) => {
    const { id, proposalId } = req.params;

    // Fetch the decision room
    const room = await DecisionRoom.findById(id)
      .populate('proposals.votes.votedBy', 'name'); // Populate the votedBy field with name

    if (!room) {
      res.status(404);
      throw new Error('Decision room not found');
    }

    // Fetch the proposal from the room
    const proposal = room.proposals.id(proposalId);
    if (!proposal) {
      res.status(404);
      throw new Error('Proposal not found');
    }

    res.json({
      ...proposal.toObject(),
      votingType: room.votingType, // Include the voting type from the decision room
    });
});

// Archive a decision room
const archiveDecisionRoom = asyncHandler(async (req, res) => {
  const room = await DecisionRoom.findById(req.params.id);

  if (!room) {
    res.status(404);
    throw new Error('Decision room not found');
  }

  if (room.createdBy.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to archive this room');
  }

  room.status = 'archived';
  await room.save();

  res.json(room);
});

// Fetch discussion for a proposal
const getProposalDiscussion = asyncHandler(async (req, res) => {
    const { id, proposalId } = req.params;
  
    try {
      const room = await DecisionRoom.findById(id);
      if (!room) {
        res.status(404);
        throw new Error('Decision room not found');
      }
  
      const proposal = room.proposals.id(proposalId);
      if (!proposal) {
        res.status(404);
        throw new Error('Proposal not found');
      }
  
      // Instead of populating inside the array, populate the entire discussion array's postedBy field
      await DecisionRoom.populate(room, {
        path: 'proposals.discussion.postedBy',
        select: 'name',
      });
  
      res.json(proposal.discussion);  // Send populated discussion
    } catch (error) {
      console.error('Error fetching proposal discussion:', error);
      res.status(500).json({ message: 'Server error while fetching discussion' });
    }
  });  

// Controller functions for updating and deleting discussion messages:
const updateDiscussionMessage = asyncHandler(async (req, res) => {
    const { id, proposalId, messageId } = req.params;
    const { messageText } = req.body;
  
    const room = await DecisionRoom.findById(id);
    if (!room) {
      res.status(404);
      throw new Error('Decision room not found');
    }
  
    const proposal = room.proposals.id(proposalId);
    if (!proposal) {
      res.status(404);
      throw new Error('Proposal not found');
    }
  
    const message = proposal.discussion.id(messageId);
    if (!message) {
      res.status(404);
      throw new Error('Message not found');
    }
  
    message.messageText = messageText;
    await room.save();
  
    // Populate `postedBy` after updating the message
    await proposal.populate('discussion.postedBy', 'name');
  
    res.status(200).json(proposal.discussion);
  });
  
  // Controller function for deleting a discussion message:
  const deleteDiscussionMessage = asyncHandler(async (req, res) => {
    const { id, proposalId, messageId } = req.params;
  
    const room = await DecisionRoom.findById(id);
    if (!room) {
      res.status(404);
      throw new Error('Decision room not found');
    }
  
    const proposal = room.proposals.id(proposalId);
    if (!proposal) {
      res.status(404);
      throw new Error('Proposal not found');
    }
  
    // Use `pull` to remove the message from the array
    proposal.discussion.pull({ _id: messageId });
  
    await room.save();
  
    res.status(200).json(proposal.discussion);
  });  

// Update an existing decision room
const updateDecisionRoom = asyncHandler(async (req, res) => {
    const { decisionRoomName, isPrivate, votingType, members } = req.body;
  
    const room = await DecisionRoom.findById(req.params.id);
    if (!room) {
      res.status(404);
      throw new Error('Decision room not found');
    }
  
    if (room.createdBy.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to update this room');
    }
  
    room.decisionRoomName = decisionRoomName || room.decisionRoomName;
    room.isPrivate = isPrivate !== undefined ? isPrivate : room.isPrivate;
    room.votingType = votingType || room.votingType;
    room.members = members || room.members;
  
    await room.save();
    res.json(room);
  });  

module.exports = {
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
};
