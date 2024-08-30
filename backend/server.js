require('dotenv').config(); // Load environment variables at the top
const express = require('express');
const cors = require('cors'); // Add this line
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const networkRoutes = require('./routes/networkRoutes');
const teamRoutes = require('./routes/teamRoutes');  // Import the new team routes

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json());
app.use(cors()); // Add this line to enable CORS

// Debugging
console.log('JWT_SECRET:', process.env.JWT_SECRET); // Ensure this prints correctly

// Define Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/network', networkRoutes);
app.use('/api/teams', teamRoutes);  // Add the new team routes here

// Error Handling Middleware (optional)
app.use((err, req, res, next) => {
  console.error(err.message);
  if (!res.headersSent) {
    res.status(500).json({ message: 'Server Error' });
  }
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
