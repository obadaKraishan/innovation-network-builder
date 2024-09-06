require('dotenv').config(); // Load environment variables at the top
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

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

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json());
app.use(cors()); // Enable CORS

// Debugging
console.log('JWT_SECRET:', process.env.JWT_SECRET);

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

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  if (!res.headersSent) {
    res.status(500).json({ message: 'Server Error' });
  }
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
