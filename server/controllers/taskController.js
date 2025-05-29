// server/controllers/taskController.js
const Task = require('../models/Task');

// @desc    Get all tasks for the logged-in user
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.userId }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    console.error('Get Tasks Error:', error);
    res.status(500).json({ message: 'Server error fetching tasks' });
  }
};

// @desc    Create a new task for the logged-in user
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  const { title, description, startDate, endDate, color } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'Task title is required' });
  }

  try {
    const task = new Task({
      title,
      description: description || '',
      user: req.user.userId,
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      color: color || '#E0E0E0', // Default color if not provided
      // status defaults to 'todo' via schema
    });

    const createdTask = await task.save();
    res.status(201).json(createdTask);
  } catch (error) {
    console.error('Create Task Error:', error);
    if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error creating task' });
  }
};

// @desc    Update a task for the logged-in user
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  const { title, description, status, startDate, endDate, color } = req.body;
  const taskId = req.params.id;

  if (status && !['todo', 'inprogress', 'done'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value.' });
  }

  try {
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.user.toString() !== req.user.userId) {
      return res.status(401).json({ message: 'Not authorized to update this task' });
    }

    if (title !== undefined) task.title = title.trim();
    if (description !== undefined) task.description = description.trim();
    if (status !== undefined) task.status = status;
    if (startDate !== undefined) task.startDate = startDate ? new Date(startDate) : null;
    if (endDate !== undefined) task.endDate = endDate ? new Date(endDate) : null;
    if (color !== undefined) task.color = color;

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    console.error('Update Task Error:', error);
     if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return res.status(400).json({ message: messages.join(', ') });
    }
    if (error.kind === 'ObjectId' && error.path === '_id') {
        return res.status(400).json({ message: 'Invalid task ID format' });
    }
    res.status(500).json({ message: 'Server error updating task' });
  }
};

// @desc    Delete a task for the logged-in user
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  const taskId = req.params.id;
  try {
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.user.toString() !== req.user.userId) {
      return res.status(401).json({ message: 'Not authorized to delete this task' });
    }

    await task.deleteOne();
    res.json({ message: 'Task removed successfully' });
  } catch (error) {
    console.error('Delete Task Error:', error);
    if (error.kind === 'ObjectId' && error.path === '_id') {
        return res.status(400).json({ message: 'Invalid task ID format' });
    }
    res.status(500).json({ message: 'Server error deleting task' });
  }
};

// @desc    Delete all tasks in 'done' status for the logged-in user
// @route   DELETE /api/tasks/clear-done
// @access  Private
const clearDoneTasks = async (req, res) => {
  try {
    // req.user.userId is attached by authMiddleware
    const result = await Task.deleteMany({ user: req.user.userId, status: 'done' });
    res.json({ 
        message: `${result.deletedCount} 'Done' task(s) cleared successfully.`, 
        deletedCount: result.deletedCount 
    });
  } catch (error) {
    console.error('Clear Done Tasks Error:', error);
    res.status(500).json({ message: 'Server error clearing done tasks' });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  clearDoneTasks, // Export the new function
};
