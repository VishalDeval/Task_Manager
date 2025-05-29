// client/src/services/taskService.js
import axios from 'axios';

// Base URL for task-related API endpoints.
// Assumes Vite proxy is configured for '/api' to point to 'http://localhost:5000'
const API_URL = '/api/tasks';

// Axios instance will use the default headers set in AuthContext (Authorization Bearer token)

export const getTasks = async () => {
  return axios.get(API_URL);
};

export const createTask = async (taskData) => {
  // taskData expected: { title, description?, startDate?, endDate?, color? }
  return axios.post(API_URL, taskData);
};

export const updateTask = async (taskId, updatedData) => {
  // updatedData expected: { title?, description?, status?, startDate?, endDate?, color? }
  return axios.put(`${API_URL}/${taskId}`, updatedData);
};

export const deleteTask = async (taskId) => {
  return axios.delete(`${API_URL}/${taskId}`);
};

// New service function to clear all 'Done' tasks
export const clearAllDoneTasks = async () => {
  return axios.delete(`${API_URL}/clear-done`);
};
