import React, { useState, useContext } from 'react';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthContext from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useContext(AuthContext);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success('Login successful!');
    } catch (error) {
      toast.error('Login failed. Please check your credentials and try again.');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-500 to-indigo-600">
      <ToastContainer />
      <div className="flex bg-white rounded-lg shadow-2xl overflow-hidden" style={{ width: '950px', height: '550px' }}>
        <div className="w-1/2 p-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">Welcome Back!</h1>
          <p className="text-gray-600 mb-8">Connect with your team and foster innovation within your organization.</p>
          <form onSubmit={submitHandler}>
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Email</label>
              <div className="flex items-center border border-gray-300 rounded-lg p-2">
                <FaEnvelope className="text-gray-400 mr-2" />
                <input
                  type="email"
                  className="w-full outline-none"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Password</label>
              <div className="flex items-center border border-gray-300 rounded-lg p-2">
                <FaLock className="text-gray-400 mr-2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="w-full outline-none"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div onClick={togglePasswordVisibility} className="cursor-pointer ml-2">
                  {showPassword ? <FaEyeSlash className="text-gray-400" /> : <FaEye className="text-gray-400" />}
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center mb-6">
              <a href="mailto:it-support@example.com" className="text-blue-500 hover:underline text-sm">Forgot Password?</a>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-3 rounded-lg font-semibold hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-700"
            >
              Log in
            </button>
          </form>
        </div>
        <div
          className="w-1/2 bg-cover bg-center relative"
          style={{
            backgroundImage: 'url("/images/login-bg.jpg")',
          }}
        >
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="flex items-center justify-center h-full text-white p-10 relative z-10">
            <div className="text-center">
              <h2 className="text-3xl font-semibold mb-6">Innovate Together</h2>
              <p className="mb-8">Empower your organization by building strong, collaborative teams. Join forces with colleagues from different departments and drive innovation.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
