import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import Sidebar from './Sidebar'; // Import the Sidebar component
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify'; // Import Toastify for notifications
import 'react-toastify/dist/ReactToastify.css';

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const [profile, setProfile] = useState({});
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [skills, setSkills] = useState('');
  const [availableSkills, setAvailableSkills] = useState([]);
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    position: '',
  });

  useEffect(() => {
    if (user) {
      // Fetch user profile
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
          setSkills(data.skills.join(', ')); // Join skills with a comma
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
    setSkills(e.target.value); // Update skills as a comma-separated string
  };

  const handleUpdateUserInfo = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5001/api/users/${user._id}`,
        { name: userInfo.name, skills: skills.split(',').map(skill => skill.trim()) }, // Split and trim skills
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
      <Sidebar /> {/* Sidebar component */}
      <div className="flex-1 p-6 bg-gray-100 overflow-y-auto">
        <h1 className="text-2xl mb-4">Profile</h1>

        <ToastContainer /> {/* Toast notifications */}

        {/* User Info Card */}
        <div className="mb-6 p-4 bg-white shadow rounded">
          <h2 className="text-xl font-semibold">User Information</h2>
          <p><strong>Name:</strong> {userInfo.name}</p>
          <p><strong>Email:</strong> {userInfo.email}</p>
          <p><strong>Position:</strong> {userInfo.position}</p>
          <p><strong>Skills:</strong> {skills}</p>
        </div>

        {/* Update User Information */}
        <form onSubmit={handleUpdateUserInfo} className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Update Information</h2>
          <div className="mb-4">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={userInfo.name}
              onChange={handleUserInfoChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label>Skills (separate with commas)</label>
            <input
              type="text"
              name="skills"
              value={skills}
              onChange={handleSkillsChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
            <small className="text-gray-500">Add or edit your skills, separating them with commas.</small>
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-700">
            Update Information
          </button>
        </form>

        {/* Update Password */}
        <form onSubmit={handleChangePassword}>
          <h2 className="text-xl font-semibold mb-4">Change Password</h2>
          <div className="mb-4">
            <label>New Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
              <button
                type="button"
                onClick={toggleShowPassword}
                className="absolute inset-y-0 right-0 p-2 text-gray-500"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
          <div className="mb-4">
            <label>Confirm New Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
              <button
                type="button"
                onClick={toggleShowPassword}
                className="absolute inset-y-0 right-0 p-2 text-gray-500"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
          <button type="submit" className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-700">
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
