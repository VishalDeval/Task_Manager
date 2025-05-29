// server/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // To potentially fetch user details if needed
const dotenv = require('dotenv');

// Load .env variables (though JWT_SECRET should already be in process.env from server.js)
if (!process.env.JWT_SECRET) {
    dotenv.config({ path: '../.env' });
}

const protect = async (req, res, next) => {
  let token;

  // Check if the Authorization header exists and starts with 'Bearer'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header (e.g., "Bearer <token>")
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach the user ID to the request object for use in subsequent controllers
      // You could also fetch the full user object here if needed, but often just the ID is enough.
      // req.user = await User.findById(decoded.userId).select('-password'); 
      // For this project, let's just attach the decoded payload which should contain userId.
      req.user = decoded; // The decoded payload should contain { userId, username, iat, exp }

      if (!req.user || !req.user.userId) {
        return res.status(401).json({ message: 'Not authorized, user ID missing from token' });
      }
      
      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      console.error('Token verification failed:', error.message);
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Not authorized, token failed (invalid)' });
      }
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Not authorized, token expired' });
      }
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

module.exports = { protect };
