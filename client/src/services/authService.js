// client/src/services/authService.js
import axios from 'axios';

// With the Vite proxy configured for '/api', this relative path is correct.
const API_URL = '/api/auth'; 

export const register = async (userData) => {
  return axios.post(`${API_URL}/register`, userData);
};

export const login = async (userData) => {
  return axios.post(`${API_URL}/login`, userData);
};
