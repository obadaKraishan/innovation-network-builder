const Message = require('../models/messageModel');
const Connection = require('../models/connectionModel');

// @desc    Send a new message
// @route   POST /api/messages
// @access  Private
const sendMessage = async (req, res) => {
  const { recipients, cc, subject, body, attachments, parentMessage } = req.body;

  try {
    const newMessage = new Message({
      sender: req.user._id,
      recipients,
      cc,
      subject,
      body,
      attachments,
      parentMessage, // Store reference to the parent message
    });

    await newMessage.save();

    // Update connections based on this message
    recipients.forEach(async (recipientId) => {
      await Connection.updateOne(
        { userA: req.user._id, userB: recipientId },
        { $set: { lastInteractedAt: Date.now() }, $inc: { interactionCount: 1 } },
        { upsert: true }
      );
    });

    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error sending message:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get inbox messages for the logged-in user
// @route   GET /api/messages/inbox
// @access  Private
const getInboxMessages = async (req, res) => {
  try {
    const messages = await Message.find({ recipients: req.user._id }).sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    console.error('Error fetching inbox messages:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get sent messages for the logged-in user
// @route   GET /api/messages/sent
// @access  Private
const getSentMessages = async (req, res) => {
  try {
    const messages = await Message.find({ sender: req.user._id })
      .populate('recipients', 'name email')
      .populate('cc', 'name email')
      .sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    console.error('Error fetching sent messages:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get important messages for the logged-in user
// @route   GET /api/messages/important
// @access  Private
const getImportantMessages = async (req, res) => {
  try {
    const messages = await Message.find({ recipients: req.user._id, isImportant: true }).sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    console.error('Error fetching important messages:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Mark a message as important
// @route   PUT /api/messages/:id/important
// @access  Private
const markMessageAsImportant = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    message.isImportant = !message.isImportant;
    await message.save();

    res.json({ message: 'Message importance updated', isImportant: message.isImportant });
  } catch (error) {
    console.error('Error marking message as important:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get message details
// @route   GET /api/messages/:id
// @access  Private
const getMessageDetails = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id)
      .populate('sender', 'name email')
      .populate('recipients', 'name email')
      .populate('cc', 'name email')
      .populate('parentMessage', 'subject sender recipients cc body createdAt'); // Populate parent message details

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.json(message);
  } catch (error) {
    console.error('Error fetching message details:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Reply to a message
// @route   POST /api/messages/:id/reply
// @access  Private
const replyToMessage = async (req, res) => {
  const { body, recipients, cc, subject, attachments } = req.body;

  try {
    const originalMessage = await Message.findById(req.params.id);

    if (!originalMessage) {
      return res.status(404).json({ message: 'Message not found' });
    }

    const newMessage = new Message({
      sender: req.user._id,
      recipients,
      cc,
      subject,
      body,
      attachments,
      parentMessage: originalMessage._id, // Set the parentMessage reference
    });

    await newMessage.save();

    // Update connection for reply
    await Connection.updateOne(
      { userA: req.user._id, userB: originalMessage.sender },
      { $set: { lastInteractedAt: Date.now() }, $inc: { interactionCount: 1 } },
      { upsert: true }
    );

    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error replying to message:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  sendMessage,
  getInboxMessages,
  getSentMessages,
  markMessageAsImportant,
  getImportantMessages,
  getMessageDetails,
  replyToMessage,
};
