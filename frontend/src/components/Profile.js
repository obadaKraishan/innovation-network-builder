import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import Sidebar from './Sidebar';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaUser, FaPen, FaSave, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const [profile, setProfile] = useState({});
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [skills, setSkills] = useState('');
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    position: '',
  });

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        try {
          const { data } = await axios.get(`http://localhost:5001/api/users/${user._id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          setProfile(data);
          setUserInfo({
            name: data.name,
            email: data.email,
            position: data.position,
          });
          setSkills(data.skills.join(', '));
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      };
      fetchProfile();
    }
  }, [user]);

  const handleUserInfoChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSkillsChange = (e) => {
    setSkills(e.target.value);
  };

  const handleUpdateUserInfo = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5001/api/users/${user._id}`,
        { name: userInfo.name, skills: skills.split(',').map(skill => skill.trim()) },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      toast.success('User information updated successfully!');
    } catch (error) {
      console.error('Error updating user information:', error);
      toast.error('Failed to update user information.');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }
    try {
      await axios.put(
        `http://localhost:5001/api/users/${user._id}/password`,
        { password: newPassword },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      toast.success('Password updated successfully!');
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error('Failed to update password.');
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-50 overflow-y-auto">
        <ToastContainer />

        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-8 shadow-lg rounded-lg mb-6">
            <div className="flex items-center mb-6">
              <FaUser className="text-4xl text-blue-500 mr-4" />
              <h1 className="text-3xl font-semibold text-gray-800">Profile</h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-700">User Information</h2>
                <p className="text-gray-600"><strong>Name:</strong> {userInfo.name}</p>
                <p className="text-gray-600"><strong>Email:</strong> {userInfo.email}</p>
                <p className="text-gray-600"><strong>Position:</strong> {userInfo.position}</p>
                <p className="text-gray-600"><strong>Skills:</strong> {skills}</p>
              </div>
              <form onSubmit={handleUpdateUserInfo} className="bg-gray-100 p-4 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">Update Information</h2>
                <div className="mb-4">
                  <label className="block text-gray-600 mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={userInfo.name}
                    onChange={handleUserInfoChange}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-600 mb-2">Skills (separate with commas)</label>
                  <input
                    type="text"
                    name="skills"
                    value={skills}
                    onChange={handleSkillsChange}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                  <small className="text-gray-500">Add or edit your skills, separating them with commas.</small>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white p-3 rounded-lg font-semibold hover:bg-blue-600 transition"
                >
                  <FaSave className="inline mr-2" />
                  Update Information
                </button>
              </form>
            </div>
          </div>

          <div className="bg-white p-8 shadow-lg rounded-lg">
            <h2 className="text-lg font-semibold text-gray-700 mb-6">Change Password</h2>
            <form onSubmit={handleChangePassword}>
              <div className="mb-4">
                <label className="block text-gray-600 mb-2">New Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={toggleShowPassword}
                    className="absolute inset-y-0 right-0 p-3 text-gray-500"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-600 mb-2">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={toggleShowPassword}
                    className="absolute inset-y-0 right-0 p-3 text-gray-500"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-green-500 text-white p-3 rounded-lg font-semibold hover:bg-green-600 transition"
              >
                <FaLock className="inline mr-2" />
                Update Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
