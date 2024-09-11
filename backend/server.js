require('dotenv').config(); // Load environment variables at the top
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const http = require('http');  // Required for setting up Socket.IO
const socketio = require('socket.io');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const networkRoutes = require('./routes/networkRoutes');
const teamRoutes = require('./routes/teamRoutes');
const messageRoutes = require('./routes/messagesRoutes'); 
const bookingRoutes = require('./routes/bookingRoutes');
const interestGroupRoutes = require('./routes/interestGroupRoutes'); 
const GroupDecisionRoutes = require('./routes/GroupDecisionRoutes');
const wellnessRoutes = require('./routes/WellnessRoutes');
const notificationRoutes = require('./routes/notificationRoutes'); // Add notification route

// Initialize Express
const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json());
app.use(cors()); // Enable CORS

// Debugging
console.log('JWT_SECRET:', process.env.JWT_SECRET);

// Create HTTP Server for Socket.IO
const server = http.createServer(app);

// Initialize Socket.IO
const io = socketio(server, {
  cors: {
    origin: '*',  // Adjust as necessary for your frontend origin
    methods: ['GET', 'POST']
  }
});

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('New WebSocket connection established');

  // Join the user to a specific room based on their user ID
  socket.on('join', (userId) => {
    console.log(`User joined room: ${userId}`);
    socket.join(userId);  // Each user has their own room for receiving notifications
  });

  // Handle user disconnection
  socket.on('disconnect', () => {
    console.log('User has disconnected');
  });
});

// Define Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes); 
app.use('/api/departments', departmentRoutes);
app.use('/api/network', networkRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/groups', interestGroupRoutes);  
app.use('/api/decisions', GroupDecisionRoutes);
app.use('/api/wellness', wellnessRoutes);
app.use('/api/notifications', notificationRoutes);  // Add notification route

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  if (!res.headersSent) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Socket.IO helper function to emit notifications
const sendNotification = (recipientId, notification) => {
  io.to(recipientId).emit('newNotification', notification);
};

// Export `sendNotification` for use in other files
module.exports = { sendNotification };

// Start server with Socket.IO
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
