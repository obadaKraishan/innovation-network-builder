// File: backend/controllers/authController.js

const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const authUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        position: user.position,
        token: generateToken(user._id, user.role), // Ensure this generates a valid JWT
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Error during authentication:', error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { authUser };
