const DecisionRoom = require("../models/GroupDecisionModel");
const Connection = require("../models/connectionModel");
const Notification = require("../models/notificationModel");
const asyncHandler = require("express-async-handler");
const { sendNotification } = require("../services/notificationService");

// Create new Connections
const createConnection = async (userA, userB, context) => {
  try {
    console.log(
      `Attempting to create connection between ${userA} and ${userB} with context: ${context}`
    );

    // Create a new connection without checking for existing ones
    const newConnection = new Connection({
      userA,
      userB,
      context,
      interactionCount: 1,
      lastInteractedAt: Date.now(),
    });

    const savedConnection = await newConnection.save();
    console.log(`Connection successfully created:`, savedConnection);

    return savedConnection;
  } catch (error) {
    console.error(
      `Error creating connection between ${userA} and ${userB} for context: ${context}:`,
      error.message
    );
  }
};

// Utility function to send notifications to members
const sendDecisionRoomNotifications = async (
  members,
  message,
  link,
  senderId
) => {
  try {
    for (const member of members) {
      const newNotification = new Notification({
        recipient: member,
        sender: senderId,
        message: message,
        type: "info",
        link,
      });
      await newNotification.save();
      sendNotification(member, newNotification);
    }
  } catch (error) {
    console.error("Error sending notifications:", error.message);
  }
};

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

  // Create connections between all members of the room
  for (let i = 0; i < members.length; i++) {
    for (let j = i + 1; j < members.length; j++) {
      await createConnection(members[i], members[j], "decision room creation");
    }
  }

  // Send notifications to members about the new decision room
  const notificationMessage = `You have been added to a new decision room: ${decisionRoomName}`;
  await sendDecisionRoomNotifications(
    members,
    notificationMessage,
    `/rooms/${room._id}`,
    req.user._id
  );

  res.status(201).json(room);
});

// Add a proposal to a decision room
const addProposal = asyncHandler(async (req, res) => {
  const { roomId, proposalTitle, proposalDescription } = req.body;

  const room = await DecisionRoom.findById(roomId);
  if (!room) {
    res.status(404);
    throw new Error("Decision room not found");
  }

  const proposal = {
    proposalTitle,
    proposalDescription,
    createdBy: req.user._id,
  };

  room.proposals.push(proposal);
  await room.save();

  // Create connections between the proposal creator and all members of the room
  for (const member of room.members) {
    await createConnection(req.user._id, member, "decision proposal creation");
  }

  // Send notifications to members about the new proposal
  const notificationMessage = `A new proposal has been added in the decision room: ${room.decisionRoomName}`;
  await sendDecisionRoomNotifications(
    room.members,
    notificationMessage,
    `/rooms/${roomId}/proposals/${proposal._id}`,
    req.user._id
  );

  res.status(201).json(room);
});

// Add a discussion message to a proposal
const addDiscussionMessage = asyncHandler(async (req, res) => {
  const { id, proposalId } = req.params;
  const { messageText, parent = null } = req.body;

  const room = await DecisionRoom.findById(id);
  if (!room) {
    return res.status(404).json({ message: "Decision room not found" });
  }

  const proposal = room.proposals.id(proposalId);
  if (!proposal) {
    return res.status(404).json({ message: "Proposal not found" });
  }

  const newMessage = {
    messageText,
    postedBy: req.user._id,
    parent,
  };

  proposal.discussion.push(newMessage);
  await room.save();

  // Populate the postedBy field for the entire discussion array
  await room.populate({
    path: "proposals.discussion.postedBy",
    select: "name",
  });

  // Create connections between the commenter and other members
  await createConnection(
    req.user._id,
    proposal.createdBy,
    "decision discussion comment"
  );

  if (parent) {
    const parentMessage = proposal.discussion.id(parent);
    if (parentMessage) {
      await createConnection(
        req.user._id,
        parentMessage.postedBy,
        "decision discussion reply"
      );
    }
  }

  // Notify members about the new discussion message
  const notificationMessage = `A new comment has been added in the decision room discussion: ${room.decisionRoomName}`;
  await sendDecisionRoomNotifications(
    room.members,
    notificationMessage,
    `/rooms/${id}/proposals/${proposalId}/discussion`,
    req.user._id
  );

  res.status(201).json(proposal.discussion);
});

// Cast a vote on a proposal
const castVote = asyncHandler(async (req, res) => {
  const { roomId, proposalId, voteValue, comment } = req.body;

  const room = await DecisionRoom.findById(roomId);
  if (!room) {
    res.status(404);
    throw new Error("Decision room not found");
  }

  const proposal = room.proposals.id(proposalId);
  if (!proposal) {
    res.status(404);
    throw new Error("Proposal not found");
  }

  if (proposal.createdBy.toString() === req.user._id.toString()) {
    return res
      .status(403)
      .json({ message: "Proposal creator cannot vote on their own proposal" });
  }

  const vote = {
    votedBy: req.user._id,
    voteValue,
    comment,
  };

  proposal.votes.push(vote);
  await room.save();

  // Create a connection between the voter and the proposal creator
  await createConnection(
    req.user._id,
    proposal.createdBy,
    "decision proposal voting"
  );

  // Notify members about the vote
  const notificationMessage = `${req.user.name} has cast a vote on the proposal: ${proposal.proposalTitle}`;
  await sendDecisionRoomNotifications(
    room.members,
    notificationMessage,
    `/rooms/${roomId}/proposals/${proposalId}`,
    req.user._id
  );

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
      .populate("createdBy")
      .populate("members", "name") // Populate the 'members' field with their names
      .populate("proposals.createdBy")
      .populate("proposals.votes.votedBy")
      .populate("proposals.discussion.postedBy");

    if (!room) {
      console.error("Decision room not found:", req.params.id);
      return res.status(404).json({ message: "Decision room not found" });
    }

    if (!room.createdBy || !room.createdBy._id) {
      console.error("Room creator information is missing");
      return res
        .status(500)
        .json({ message: "Room creator information is missing" });
    }

    console.log("Fetched room details:", room);
    res.json(room);
  } catch (error) {
    console.error("Error fetching room details:", error.message);
    res
      .status(500)
      .json({ message: "Server error while fetching room details" });
  }
});

// Get proposal details by roomId and proposalId
const getProposalDetails = asyncHandler(async (req, res) => {
  const { id, proposalId } = req.params;

  // Fetch the decision room
  const room = await DecisionRoom.findById(id)
    .populate("proposals.createdBy", "name") // Populate the createdBy field with the user's name or ID
    .populate("proposals.votes.votedBy", "name"); // Populate the votedBy field with name

  if (!room) {
    res.status(404);
    throw new Error("Decision room not found");
  }

  // Fetch the proposal from the room
  const proposal = room.proposals.id(proposalId);
  if (!proposal) {
    res.status(404);
    throw new Error("Proposal not found");
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
    throw new Error("Decision room not found");
  }

  if (room.createdBy.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to archive this room");
  }

  room.status = "archived";
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
      throw new Error("Decision room not found");
    }

    const proposal = room.proposals.id(proposalId);
    if (!proposal) {
      res.status(404);
      throw new Error("Proposal not found");
    }

    // Instead of populating inside the array, populate the entire discussion array's postedBy field
    await DecisionRoom.populate(room, {
      path: "proposals.discussion.postedBy",
      select: "name",
    });

    res.json(proposal.discussion); // Send populated discussion
  } catch (error) {
    console.error("Error fetching proposal discussion:", error);
    res.status(500).json({ message: "Server error while fetching discussion" });
  }
});

// Controller functions for updating and deleting discussion messages:
const updateDiscussionMessage = asyncHandler(async (req, res) => {
  const { id, proposalId, messageId } = req.params;
  const { messageText } = req.body;

  const room = await DecisionRoom.findById(id);
  if (!room) {
    return res.status(404).json({ message: "Decision room not found" });
  }

  const proposal = room.proposals.id(proposalId);
  if (!proposal) {
    return res.status(404).json({ message: "Proposal not found" });
  }

  const message = proposal.discussion.id(messageId);
  if (!message) {
    return res.status(404).json({ message: "Message not found" });
  }

  message.messageText = messageText;
  await room.save();

  // Populate the postedBy field for all messages
  await room.populate({
    path: "proposals.discussion.postedBy",
    select: "name",
  });

  res.status(200).json(proposal.discussion);
});

// Controller function for deleting a discussion message:
const deleteDiscussionMessage = asyncHandler(async (req, res) => {
  const { id, proposalId, messageId } = req.params;

  const room = await DecisionRoom.findById(id);
  if (!room) {
    res.status(404);
    throw new Error("Decision room not found");
  }

  const proposal = room.proposals.id(proposalId);
  if (!proposal) {
    res.status(404);
    throw new Error("Proposal not found");
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
    throw new Error("Decision room not found");
  }

  if (room.createdBy.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to update this room");
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
