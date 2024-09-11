import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const login = async (email, password) => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
      
      const { data } = await axios.post('http://localhost:5001/api/auth/login', { email, password });
      
      localStorage.setItem('userInfo', JSON.stringify(data));
      localStorage.setItem('token', data.token); // Store JWT token
      
      setUser(data); 
      navigate('/dashboard'); 
    } catch (error) {
      console.error('Login failed', error.response?.data?.message || error.message);
    }
  };  

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
    localStorage.removeItem('token');
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

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);

export default AuthContext;
