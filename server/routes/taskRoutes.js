// server/routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const { 
    getTasks, 
    createTask, 
    updateTask, 
    deleteTask, 
    clearDoneTasks // Import new controller function
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

// Protect all routes defined below
router.use(protect);

// Route for clearing all 'Done' tasks for the authenticated user
// This should be defined before routes with parameters like /:id to avoid conflicts
router.delete('/clear-done', clearDoneTasks);

// Routes for general task operations (GET all, POST new)
router.route('/')
  .get(getTasks)
  .post(createTask);

// Routes for specific task operations by ID (PUT update, DELETE single)
router.route('/:id')
  .put(updateTask)
  .delete(deleteTask);

module.exports = router;
