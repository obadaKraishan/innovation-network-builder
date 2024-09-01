import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUserEdit, FaTrashAlt, FaSave, FaArrowLeft, FaKey, FaEye, FaEyeSlash, FaBriefcase, FaRegEnvelope, FaStar, FaCogs } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import Sidebar from './Sidebar'; // Import Sidebar component

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [departments, setDepartments] = useState([]);
  const [subDepartments, setSubDepartments] = useState([]);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Fetch user details
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await axios.get(`http://localhost:5001/api/users/${id}`, config);
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user:', error);
        toast.error('Error fetching user details');
      }
    };

    // Fetch departments
    const fetchDepartments = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await axios.get('http://localhost:5001/api/departments', config);
        setDepartments(response.data);
      } catch (error) {
        console.error('Error fetching departments:', error);
        toast.error('Error fetching departments');
      }
    };

    fetchUser();
    fetchDepartments();
  }, [id]);

  useEffect(() => {
    // Fetch sub-departments based on selected department
    const fetchSubDepartments = async () => {
      if (user.department) {
        try {
          const token = localStorage.getItem('token');
          const config = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: { parentDepartment: user.department },
          };
          const response = await axios.get('http://localhost:5001/api/departments/sub-departments', config);
          setSubDepartments(response.data);
        } catch (error) {
          console.error('Error fetching sub-departments:', error);
          toast.error('Error fetching sub-departments');
        }
      } else {
        setSubDepartments([]); // Clear sub-departments if no parent department is selected
      }
    };
    fetchSubDepartments();
  }, [user.department]);

  const handleInputChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleUpdateUser = async () => {
    if (password && password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      if (password) {
        await axios.put(`http://localhost:5001/api/users/${id}/password`, { password }, config);
      }

      await axios.put(`http://localhost:5001/api/users/${id}`, user, config);
      toast.success('User updated successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Error updating user details');
    }
  };

  const handleDeleteUser = async () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem('token');
          const config = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
          await axios.delete(`http://localhost:5001/api/users/${id}`, config);
          Swal.fire('Deleted!', 'User has been deleted.', 'success');
          navigate('/manage-users');
        } catch (error) {
          console.error('Error deleting user:', error);
          toast.error('Error deleting user');
        }
      }
    });
  };

  return (
    <div className="flex h-screen">
      <Sidebar /> {/* Include the Sidebar component */}
      <div className="flex-1 bg-gray-50 p-6 overflow-y-auto">
        <ToastContainer />
        <button
          onClick={() => navigate('/manage-users')}
          className="mb-4 bg-blue-500 text-white py-2 px-4 rounded inline-flex items-center shadow-md hover:bg-blue-600 transition"
        >
          <FaArrowLeft className="mr-2" />
          Back
        </button>
        <h1 className="text-3xl font-bold text-gray-800 mb-8">User Details</h1>
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2 flex items-center">
              <FaUserEdit className="mr-2 text-gray-500" /> Name
            </label>
            <input
              type="text"
              name="name"
              value={user.name || ''}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500"
              readOnly={!isEditing}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2 flex items-center">
              <FaRegEnvelope className="mr-2 text-gray-500" /> Email
            </label>
            <input
              type="email"
              name="email"
              value={user.email || ''}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500"
              readOnly={!isEditing}
            />
          </div>
          {isEditing && (
            <>
              <div className="mb-6">
                <label className="block text-gray-700 font-bold mb-2 flex items-center">
                  <FaKey className="mr-2 text-gray-500" /> Password
                </label>
                <div className="relative">
                  <input
                    type={isPasswordVisible ? 'text' : 'password'}
                    name="password"
                    value={password}
                    onChange={handlePasswordChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                    className="absolute inset-y-0 right-0 px-3 flex items-center"
                  >
                    {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 font-bold mb-2 flex items-center">
                  <FaKey className="mr-2 text-gray-500" /> Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={isConfirmPasswordVisible ? 'text' : 'password'}
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                    className="absolute inset-y-0 right-0 px-3 flex items-center"
                  >
                    {isConfirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
            </>
          )}
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2 flex items-center">
              <FaBriefcase className="mr-2 text-gray-500" /> Position
            </label>
            <input
              type="text"
              name="position"
              value={user.position || ''}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500"
              readOnly={!isEditing}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2 flex items-center">
              <FaCogs className="mr-2 text-gray-500" /> Skills
            </label>
            <input
              type="text"
              name="skills"
              value={user.skills?.join(', ') || ''}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500"
              readOnly={!isEditing}
              placeholder="Comma-separated skills"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2 flex items-center">
              <FaBriefcase className="mr-2 text-gray-500" /> Role
            </label>
            <select
              name="role"
              value={user.role || ''}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500"
              disabled={!isEditing}
            >
              <option value="Employee">Employee</option>
              <option value="Team Leader">Team Leader</option>
              <option value="Department Manager">Department Manager</option>
              <option value="Director of HR">Director of HR</option>
              <option value="Director of Finance">Director of Finance</option>
              <option value="CTO">CTO</option>
              <option value="CEO">CEO</option>
            </select>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2 flex items-center">
              <FaCogs className="mr-2 text-gray-500" /> Department
            </label>
            <select
              name="department"
              value={user.department || ''}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500"
              disabled={!isEditing}
            >
              {departments.map((dept) => (
                <option key={dept._id} value={dept._id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
          {subDepartments.length > 0 && (
            <div className="mb-6">
              <label className="block text-gray-700 font-bold mb-2 flex items-center">
                <FaCogs className="mr-2 text-gray-500" /> Sub-Department
              </label>
              <select
                name="subDepartment"
                value={user.subDepartment || ''}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500"
                disabled={!isEditing}
              >
                {subDepartments.map((subDept) => (
                  <option key={subDept._id} value={subDept._id}>
                    {subDept.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="flex justify-end space-x-4">
            {isEditing ? (
              <button
                onClick={handleUpdateUser}
                className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center shadow-md hover:bg-green-600 transition"
              >
                <FaSave className="mr-2" />
                Save
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-yellow-500 text-white px-4 py-2 rounded-lg flex items-center shadow-md hover:bg-yellow-600 transition"
              >
                <FaUserEdit className="mr-2" />
                Edit
              </button>
            )}
            <button
              onClick={handleDeleteUser}
              className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center shadow-md hover:bg-red-600 transition"
            >
              <FaTrashAlt className="mr-2" />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
