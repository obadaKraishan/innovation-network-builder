const InterestGroup = require('../models/interestGroupModel');
const User = require('../models/userModel');

// Utility function to add a member to a group
const addMemberToGroup = async (group, userId) => {
  if (!group.members.includes(userId)) {
    group.members.push(userId);
  }
};

// Utility function to create connections between discussion participants
const createDiscussionConnections = async (group, commenterId, parentCommentId) => {
  const participants = new Set();
  participants.add(commenterId.toString());

  // Collect all participants in the discussion
  group.interestGroupDiscussions.forEach(discussion => {
    if (discussion._id.toString() === parentCommentId?.toString()) {
      participants.add(discussion.user.toString()); // Add the parent comment author
    }
    participants.add(discussion.user.toString()); // Add all users who commented
  });

  const participantsArray = Array.from(participants);

  for (let i = 0; i < participantsArray.length; i++) {
    for (let j = i + 1; j < participantsArray.length; j++) {
      const userA = participantsArray[i];
      const userB = participantsArray[j];
      // Implement your logic to create or update connections between userA and userB
    }
  }
};

// @desc    Create a new interest group
// @route   POST /api/groups/create
// @access  Private
const createGroup = async (req, res) => {
  try {
    const { name, description, objectives, hobbies, members } = req.body;

    const group = new InterestGroup({
      name,
      description,
      objectives,
      hobbies,
      members,
      createdBy: req.user._id,
    });

    const savedGroup = await group.save();
    res.status(201).json(savedGroup);
  } catch (error) {
    console.error('Error creating group:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all interest groups or filter by user
// @route   GET /api/groups
// @access  Private
const getGroups = async (req, res) => {
  try {
    const { filter } = req.query;
    let groups;

    if (filter === 'created') {
      groups = await InterestGroup.find({ createdBy: req.user._id })
        .populate('members', 'name')
        .populate('createdBy', 'name'); // Populate createdBy field
    } else if (filter === 'joined') {
      groups = await InterestGroup.find({ members: req.user._id })
        .populate('members', 'name')
        .populate('createdBy', 'name'); // Populate createdBy field
    } else {
      groups = await InterestGroup.find()
        .populate('members', 'name')
        .populate('createdBy', 'name'); // Populate createdBy field
    }

    res.status(200).json(groups);
  } catch (error) {
    console.error('Error fetching groups:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get details of a specific group by ID
// @route   GET /api/groups/:id
// @access  Private
const getGroupById = async (req, res) => {
    try {
        const group = await InterestGroup.findById(req.params.id)
        .populate('members', 'name email') // Populate both name and email
        .populate('createdBy', 'name')
        .populate({
            path: 'interestGroupDiscussions',
            populate: { path: 'user', select: 'name' }
        });

        if (!group) {
        return res.status(404).json({ message: 'Group not found' });
        }

        res.status(200).json(group);
    } catch (error) {
        console.error('Error fetching group details:', error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};  

// @desc    Update group details (for group owners)
// @route   PUT /api/groups/:id
// @access  Private
const updateGroup = async (req, res) => {
  try {
    const group = await InterestGroup.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    if (group.createdBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updatedGroup = await InterestGroup.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedGroup);
  } catch (error) {
    console.error('Error updating group:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a group (only for the creator)
// @route   DELETE /api/groups/:id
// @access  Private
const deleteGroup = async (req, res) => {
    try {
        const group = await InterestGroup.findById(req.params.id);

        if (!group) {
        return res.status(404).json({ message: 'Group not found' });
        }

        if (group.createdBy.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized' });
        }

        await InterestGroup.findByIdAndDelete(req.params.id); // Use findByIdAndDelete for deletion

        res.status(200).json({ message: 'Group removed successfully' });
    } catch (error) {
        console.error('Error deleting group:', error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};  

// @desc    Leave a group
// @route   PUT /api/groups/:id/leave
// @access  Private
const leaveGroup = async (req, res) => {
    try {
        console.log(`Leave group request received for ID: ${req.params.id}`); // Log the ID
        const group = await InterestGroup.findById(req.params.id);

        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        // Check if the user is a member of the group
        if (!group.members.includes(req.user._id)) {
            return res.status(400).json({ message: 'You are not a member of this group' });
        }

        // Remove the user from the members array
        group.members = group.members.filter(member => member.toString() !== req.user._id.toString());

        await group.save();

        res.status(200).json({ message: 'Successfully left the group' });
    } catch (error) {
        console.error('Error leaving group:', error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get received invitations for the logged-in user
// @route   GET /api/groups/invitations/received
// @access  Private
const getReceivedInvitations = async (req, res) => {
    try {
      const groups = await InterestGroup.find({ 'invitations.userId': req.user._id })
        .populate('createdBy', 'name')
        .populate('invitations.userId', 'name');
  
      const receivedInvitations = groups
        .map(group => group.invitations.filter(inv => inv.userId.toString() === req.user._id.toString() && inv.status === 'pending'))
        .flat();
  
      res.status(200).json(receivedInvitations);
    } catch (error) {
      console.error('Error fetching received invitations:', error.message);
      res.status(500).json({ message: 'Server Error' });
    }
  };
  
  // @desc    Get sent invitations by the logged-in user
  // @route   GET /api/groups/invitations/sent
  // @access  Private
  const getSentInvitations = async (req, res) => {
    try {
      const groups = await InterestGroup.find({ createdBy: req.user._id })
        .populate('createdBy', 'name')
        .populate('invitations.userId', 'name');
  
      const sentInvitations = groups
        .map(group => group.invitations.filter(inv => inv.status === 'pending'))
        .flat();
  
      res.status(200).json(sentInvitations);
    } catch (error) {
      console.error('Error fetching sent invitations:', error.message);
      res.status(500).json({ message: 'Server Error' });
    }
  };  

// @desc    Invite members to the group
// @route   POST /api/groups/:id/invite
// @access  Private
const sendInvitation = async (req, res) => {
    try {
      console.log('Request to send invitation received');
      const group = await InterestGroup.findById(req.params.id);
  
      if (!group) {
        console.error('Group not found with ID:', req.params.id);
        return res.status(404).json({ message: 'Group not found' });
      }
  
      console.log('Group found:', group.name);
  
      if (group.createdBy.toString() !== req.user._id.toString()) {
        console.warn('Unauthorized access attempt by user:', req.user._id);
        return res.status(401).json({ message: 'Not authorized' });
      }
  
      const { userId } = req.body;
      console.log('User to invite:', userId);
  
      if (group.members.includes(userId)) {
        console.warn('User is already a member:', userId);
        return res.status(400).json({ message: 'User is already a member' });
      }
  
      group.invitations.push({ userId, status: 'pending' });
      await group.save();
      console.log('Invitation sent successfully to:', userId);
  
      res.status(200).json(group);
    } catch (error) {
      console.error('Error sending invitation:', error.message);
      res.status(500).json({ message: 'Server Error' });
    }
  };

// @desc    Request to join the group or send invitations to users
// @route   POST /api/groups/:id/join
// @access  Private
const requestToJoinGroup = async (req, res) => {
    try {
      const group = await InterestGroup.findById(req.params.id);
  
      if (!group) {
        return res.status(404).json({ message: 'Group not found' });
      }
  
      // If the user is the group creator, handle invitation logic
      if (group.createdBy.toString() === req.user._id.toString()) {
        const { userId } = req.body;
        if (group.members.includes(userId)) {
          return res.status(400).json({ message: 'User is already a member' });
        }
  
        group.invitations.push({ userId, status: 'pending' });
        await group.save();
  
        return res.status(200).json({ message: 'Invitation sent successfully' });
      }
  
      // If the user is not the group creator, handle join request logic
      if (!group.invitations.some(inv => inv.userId.toString() === req.user._id.toString() && inv.status === 'pending')) {
        group.invitations.push({ userId: req.user._id, status: 'pending' });
        await group.save();
  
        return res.status(200).json({ message: 'Join request sent successfully' });
      } else {
        return res.status(400).json({ message: 'Join request already sent' });
      }
  
    } catch (error) {
      console.error('Error handling join request or invitation:', error.message);
      res.status(500).json({ message: 'Server Error' });
    }
  };

// @desc    Accept or decline invitations
// @route   PUT /api/groups/invitation/:invitationId
// @access  Private
const manageInvitation = async (req, res) => {
  try {
    const { invitationId } = req.params;
    const { status } = req.body;

    const group = await InterestGroup.findOne({ 'invitations._id': invitationId });

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    const invitation = group.invitations.id(invitationId);

    if (!invitation) {
      return res.status(404).json({ message: 'Invitation not found' });
    }

    if (invitation.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    invitation.status = status;

    if (status === 'accepted') {
      await addMemberToGroup(group, req.user._id);
    }

    await group.save();

    res.status(200).json(group);
  } catch (error) {
    console.error('Error managing invitation:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Add a comment or reply to an interest group discussion
// @route   POST /api/groups/:id/comments
// @access  Private
const addInterestGroupComment = async (req, res) => {
  try {
    const { comment, parent } = req.body;
    const group = await InterestGroup.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    const newComment = {
      user: req.user._id,
      comment,
      parent: parent || null,
      createdAt: new Date(),
    };

    group.interestGroupDiscussions.push(newComment);
    await group.save();

    // Create connections between participants
    await createDiscussionConnections(group, req.user._id, parent);

    res.status(201).json(newComment);
  } catch (error) {
    console.error('Error adding comment:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update a comment in an interest group discussion
// @route   PUT /api/groups/:id/comments/:commentId
// @access  Private
const updateInterestGroupComment = async (req, res) => {
  try {
    const { comment } = req.body;
    const group = await InterestGroup.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    const discussion = group.interestGroupDiscussions.id(req.params.commentId);
    if (!discussion) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (discussion.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this comment' });
    }

    discussion.comment = comment;
    await group.save();

    res.status(200).json(discussion);
  } catch (error) {
    console.error('Error updating comment:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a comment from an interest group discussion
// @route   DELETE /api/groups/:id/comments/:commentId
// @access  Private
const deleteInterestGroupComment = async (req, res) => {
  try {
    const group = await InterestGroup.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    const discussion = group.interestGroupDiscussions.id(req.params.commentId);
    if (!discussion) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (discussion.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    group.interestGroupDiscussions.pull(discussion._id);
    await group.save();

    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  createGroup,
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
};
