// File: frontend/src/utils/api.js

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5001/api',
});

api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token'); // Ensure we're using the correct key
    console.log('Token being used:', token); // Add this log to confirm the token is being set
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn('No token found in localStorage.');
    }
    return config;
  },
  error => {
    console.error('Error in request interceptor:', error);
    return Promise.reject(error);
  }
);

export default api;
