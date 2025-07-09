// server/server.js (Modified)
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// --- API Routes ---
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

// Mount the routes - Define API routes AFTER the middleware
app.use('/api/auth', authRoutes); // Routes for authentication
app.use('/api/tasks', taskRoutes); // Routes for task management (protected)


// Basic Route
app.get('/', (req, res) => {
  res.send('Task Manager API Server is running...');
});

const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
  console.log(PORT)
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

process.on('unhandledRejection', (err, promise) => {
  console.error(`Error: ${err.message}`);
  process.exit(1);
});
