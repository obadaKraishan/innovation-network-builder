// File: backend/services/notificationService.js

let io;

const initSocket = (socketIoInstance) => {
  io = socketIoInstance;
};

const sendNotification = (recipientId, notification) => {
  if (io) {
    io.to(recipientId).emit('newNotification', notification);
  } else {
    console.error('Socket.io instance not initialized');
  }
};

module.exports = { sendNotification, initSocket };
