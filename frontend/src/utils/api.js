// File: frontend/src/utils/api.js

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5001/api', // Adjust the baseURL as per your backend's URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
