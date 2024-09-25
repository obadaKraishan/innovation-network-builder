// File: backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const http = require('http');
const socketio = require('socket.io');
const { initSocket } = require('./services/notificationService');  // Import initSocket function

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
const notificationRoutes = require('./routes/notificationRoutes');
const innovationRoutes = require('./routes/innovationRoutes');
const supportRoutes = require('./routes/supportRoutes'); // Import Support Ticket routes
const courseRoutes = require('./routes/courseRoutes'); // Import Course routes for E-learning

// Initialize Express
const app = express();

// Connect to Database
connectDB();

// Init Middleware
app.use(express.json());
app.use(cors());

// Debugging
console.log('JWT_SECRET:', process.env.JWT_SECRET);

// Create HTTP Server for Socket.IO
const server = http.createServer(app);

// Initialize Socket.IO
const io = socketio(server, {
  cors: {
    origin: '*',  // Adjust for your frontend origin
    methods: ['GET', 'POST'],
  },
});

// Initialize the Socket.IO service
initSocket(io);

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('New WebSocket connection established');

  // Join the user to a specific room based on their user ID
  socket.on('join', (userId) => {
    console.log(`User joined room: ${userId}`);
    socket.join(userId);
  });

  // Handle user disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected');
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
app.use('/api/notifications', notificationRoutes);
app.use('/api/innovation', innovationRoutes);
app.use('/api/support', supportRoutes);  // Added Customer Support Ticket routes
app.use('/api/courses', courseRoutes);  // Added E-Learning system routes

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  if (!res.headersSent) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Start the server
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
