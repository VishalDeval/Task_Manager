// server/controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Load .env variables if not already present (though server.js should handle this)
if (!process.env.JWT_SECRET) {
    dotenv.config({ path: '../.env' }); // Adjust path if .env is in server root
}

// Utility function to generate JWT
const generateToken = (userId, username) => {
  return jwt.sign(
    { userId, username }, // Payload: include userId and username
    process.env.JWT_SECRET,
    { expiresIn: '1d' } // Token expires in 1 day (adjust as needed)
  );
};

// @desc    Register a new user and log them in
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Please provide username and password' });
  }

  if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
  }

  try {
    const userExists = await User.findOne({ username });

    if (userExists) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // The password will be hashed by the pre-save middleware in User.js
    const user = await User.create({
      username,
      password,
    });

    if (user) {
      // User created successfully, now generate and return a token for auto-login
      const token = generateToken(user._id, user.username);
      res.status(201).json({
        _id: user._id,
        username: user.username,
        token: token, // Send the token back
        message: 'User registered and logged in successfully' // Updated message
      });
    } else {
      // This case should ideally not be reached if create is successful and no errors thrown
      res.status(400).json({ message: 'Invalid user data during registration' });
    }
  } catch (error) {
    console.error('Registration Error:', error);
    if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// @desc    Authenticate user & get token (Login)
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Please provide username and password' });
  }

  try {
    const user = await User.findOne({ username }).select('+password');

    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id, user.username);
      res.json({
        _id: user._id,
        username: user.username,
        token: token,
      });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
