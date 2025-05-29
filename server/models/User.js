// server/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true, // Ensures usernames are unique
    trim: true,   // Removes whitespace from both ends of a string
    minlength: [3, 'Username must be at least 3 characters long']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false // Prevents password from being returned by default in queries
  }
}, {
  timestamps: true // Adds createdAt and updatedAt timestamps automatically
});

// Middleware to hash password before saving a new user
userSchema.pre('save', async function(next) {
  // Only run this function if password was actually modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }

  // Hash the password with cost of 12
  const salt = await bcrypt.genSalt(10); // Salt rounds, 10-12 is common
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare candidate password with the user's hashed password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
