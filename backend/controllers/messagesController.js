// File: backend/controllers/messagesController.js

const Message = require('../models/messageModel');
const Connection = require('../models/connectionModel');

// @desc    Send a new message
// @route   POST /api/messages
// @access  Private
const sendMessage = async (req, res) => {
  const { recipients, cc, subject, body, attachments } = req.body;

  try {
    const newMessage = new Message({
      sender: req.user._id,
      recipients,
      cc,
      subject,
      body,
      attachments,
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

// Additional functions: getInboxMessages, getSentMessages, markMessageAsImportant, etc.

module.exports = { sendMessage };
