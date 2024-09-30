// File: frontend/src/utils/api.js

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5001/api',
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('Token being sent in request:', token); // Log token here
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Ensure correct syntax
    } else {
      console.warn('No token found in localStorage.');
    }
    return config;
  },
  (error) => {
    console.error('Error in request interceptor:', error);
    return Promise.reject(error);
  }
);

export default api;
