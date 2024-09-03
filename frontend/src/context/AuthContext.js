// File: frontend/src/context/AuthContext.js

import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const login = async (email, password) => {
    try {
      // Clear any previous data
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
  
      // Perform the login
      const { data } = await axios.post('http://localhost:5001/api/auth/login', { email, password });
      
      // Store the user data in localStorage
      localStorage.setItem('userInfo', JSON.stringify(data));
      localStorage.setItem('token', data.token); // Store the JWT token
      
      setUser(data); // Update the user state
      navigate('/dashboard'); // Navigate to the dashboard
    } catch (error) {
      console.error('Login failed', error.response?.data?.message || error.message);
    }
  };  

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
    localStorage.removeItem('token'); // Clear token on logout
    navigate('/login');
  };

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
