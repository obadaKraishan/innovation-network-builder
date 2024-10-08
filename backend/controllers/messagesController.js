const { sendNotification } = require('../services/notificationService');
const Message = require('../models/messageModel');
const Connection = require('../models/connectionModel');
const Notification = require('../models/notificationModel');

// Utility function to create a new connection between two users
const createConnection = async (userA, userB, context) => {
  try {
    console.log(`Attempting to create connection between ${userA} and ${userB} with context: ${context}`);

    const newConnection = new Connection({
      userA,
      userB,
      context,
      interactionCount: 1,
      lastInteractedAt: Date.now(),
    });

    const savedConnection = await newConnection.save();
    console.log(`Connection successfully created:`, savedConnection);

    // Return the saved connection to avoid querying again
    return savedConnection;
  } catch (error) {
    console.error(`Error creating connection between ${userA} and ${userB} for context: ${context}:`, error.message);
  }
};

// @desc Send a new message
// @route POST /api/messages
// @access Private
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
      parentMessage,
    });

    await newMessage.save();

    // Update the parent message if it's a reply
    if (parentMessage) {
      await Message.findByIdAndUpdate(parentMessage, {
        $push: { childMessages: newMessage._id },
      });
    }

    // Create new connections based on this message
    for (const recipientId of recipients) {
      const savedConnection = await createConnection(req.user._id, recipientId, 'message');
      console.log('Saved Connection:', savedConnection);

      // Create and save notification in the database
      const notificationMessage = `${req.user.name} sent you a message: "${subject}"`;
      const newNotification = new Notification({
        recipient: recipientId,
        sender: req.user._id,
        message: notificationMessage,
        type: 'info',
        link: `/messages/${newMessage._id}`,  // Link to the message details
      });

      await newNotification.save();

      // Send a real-time notification to each recipient
      sendNotification(recipientId, newNotification);
    }

    if (cc && cc.length > 0) {
      for (const ccId of cc) {
        const savedConnection = await createConnection(req.user._id, ccId, 'message');
        console.log('Saved Connection:', savedConnection);

        // Create and save notification for CC'd users
        const notificationMessage = `${req.user.name} CC'd you in a message: "${subject}"`;
        const newNotification = new Notification({
          recipient: ccId,
          sender: req.user._id,
          message: notificationMessage,
          type: 'info',
          link: `/messages/${newMessage._id}`,
        });

        await newNotification.save();

        // Send a real-time notification to CC'd users
        sendNotification(ccId, newNotification);
      }
    }

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
    const messages = await Message.find({
      recipients: req.user._id,
      parentMessage: null,  // Fetch only parent messages
    })
      .sort({ createdAt: -1 })
      .populate('sender', 'name email')
      .populate('recipients', 'name email')
      .populate('cc', 'name email')
      .populate({
        path: 'childMessages',
        populate: [
          { path: 'sender', select: 'name email' },
          { path: 'recipients', select: 'name email' },
          { path: 'cc', select: 'name email' },
        ],
      });

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
    const messages = await Message.find({
      sender: req.user._id,
      parentMessage: null,  // Fetch only parent messages
    })
      .populate('recipients', 'name email')
      .populate('cc', 'name email')
      .sort({ createdAt: -1 })
      .populate({
        path: 'childMessages',
        populate: [
          { path: 'sender', select: 'name email' },
          { path: 'recipients', select: 'name email' },
          { path: 'cc', select: 'name email' },
        ],
      });

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

// Helper function to recursively fetch child messages
const fetchChildMessages = async (parentMessageId) => {
  console.log(`Fetching child messages for parentMessageId: ${parentMessageId}`);
  const childMessages = await Message.find({ parentMessage: parentMessageId })
    .populate('sender', 'name email')
    .populate('recipients', 'name email')
    .populate('cc', 'name email')
    .sort({ createdAt: 1 });

  console.log(`Found ${childMessages.length} child messages for parentMessageId: ${parentMessageId}`);

  // Recursively fetch replies to the child messages
  for (let childMessage of childMessages) {
    childMessage.childMessages = await fetchChildMessages(childMessage._id);
  }

  return childMessages;
};

// @desc    Get message details
// @route   GET /api/messages/:id
// @access  Private
const getMessageDetails = async (req, res) => {
  try {
    console.log(`Fetching message details for messageId: ${req.params.id}`);
    const message = await Message.findById(req.params.id)
      .populate('sender', 'name email')
      .populate('recipients', 'name email')
      .populate('cc', 'name email')
      .populate({
        path: 'childMessages',
        populate: [
          { path: 'sender', select: 'name email' },
          { path: 'recipients', select: 'name email' },
          { path: 'cc', select: 'name email' },
        ],
        options: { sort: { createdAt: 1 } },
      })
      .lean(); // Converts Mongoose document to plain JS object for easy manipulation

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Recursively populate child messages
    message.childMessages = await fetchChildMessages(message._id);

    console.log(`Message details fetched successfully for messageId: ${req.params.id}`);
    console.log('Populated Message:', message);

    res.json(message);
  } catch (error) {
    console.error('Error fetching message details:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc Reply to a message
// @route POST /api/messages/:id/reply
// @access Private
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
      parentMessage: originalMessage._id,
    });

    await newMessage.save();

    // Update the original message to include this reply
    await Message.findByIdAndUpdate(originalMessage._id, {
      $push: { childMessages: newMessage._id },
    });

    // Create new connections and send notifications
    for (const recipientId of recipients) {
      const savedConnection = await createConnection(req.user._id, recipientId, 'message reply');
      console.log('Saved Connection:', savedConnection);

      // Create and save notification in the database
      const notificationMessage = `${req.user.name} replied to a message: "${subject}"`;
      const newNotification = new Notification({
        recipient: recipientId,
        sender: req.user._id,
        message: notificationMessage,
        type: 'info',
        link: `/messages/${newMessage._id}`,
      });

      await newNotification.save();

      // Send real-time notification
      sendNotification(recipientId, newNotification);
    }

    if (cc && cc.length > 0) {
      for (const ccId of cc) {
        const savedConnection = await createConnection(req.user._id, ccId, 'message reply');
        console.log('Saved Connection:', savedConnection);

        // Create and save notification for CC'd users
        const notificationMessage = `${req.user.name} CC'd you in a reply: "${subject}"`;
        const newNotification = new Notification({
          recipient: ccId,
          sender: req.user._id,
          message: notificationMessage,
          type: 'info',
          link: `/messages/${newMessage._id}`,
        });

        await newNotification.save();

        // Send real-time notification
        sendNotification(ccId, newNotification);
      }
    }

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
