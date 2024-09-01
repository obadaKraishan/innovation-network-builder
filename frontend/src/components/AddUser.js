import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './Sidebar'; // Import Sidebar component
import { FaArrowLeft, FaUserPlus, FaRegEnvelope, FaKey, FaBriefcase, FaCogs, FaStar } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddUser = () => {
  const [departments, setDepartments] = useState([]);
  const [subDepartments, setSubDepartments] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Employee',
    department: '',
    subDepartment: '',
    skills: '',
    position: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch main departments from the backend
    const fetchDepartments = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await axios.get('http://localhost:5001/api/departments/main', config);
        setDepartments(response.data);
      } catch (error) {
        console.error('Error fetching departments:', error);
        toast.error('Error fetching departments');
      }
    };
    fetchDepartments();
  }, []);

  useEffect(() => {
    // Fetch sub-departments based on selected department
    const fetchSubDepartments = async () => {
      if (formData.department) {
        try {
          const token = localStorage.getItem('token');
          const config = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: { parentDepartment: formData.department },
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
  }, [formData.department]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.post('http://localhost:5001/api/users', formData, config);
      toast.success('User added successfully!');
      setTimeout(() => navigate('/manage-users'), 2000);
    } catch (error) {
      console.error('Error adding user:', error);
      toast.error('Error adding user');
    }
  };

  const handleBackButtonClick = () => {
    navigate('/manage-users');
  };

  return (
    <div className="flex h-screen">
      <Sidebar /> {/* Include the Sidebar component */}
      <div className="flex-1 bg-gray-50 p-6 overflow-y-auto">
        <ToastContainer />
        <button
          onClick={handleBackButtonClick}
          className="mb-4 bg-blue-500 text-white py-2 px-4 rounded inline-flex items-center shadow-md hover:bg-blue-600 transition"
        >
          <FaArrowLeft className="mr-2" />
          Back to Manage Users
        </button>
        <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
          <FaUserPlus className="mr-2 text-blue-500" /> Add New User
        </h1>
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg">
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2 flex items-center">
              <FaUserPlus className="mr-2 text-gray-500" /> Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2 flex items-center">
              <FaRegEnvelope className="mr-2 text-gray-500" /> Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2 flex items-center">
              <FaKey className="mr-2 text-gray-500" /> Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2 flex items-center">
              <FaBriefcase className="mr-2 text-gray-500" /> Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              required
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
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2 flex items-center">
              <FaCogs className="mr-2 text-gray-500" /> Department
            </label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              required
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept._id} value={dept._id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
          {subDepartments.length > 0 && (
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2 flex items-center">
                <FaCogs className="mr-2 text-gray-500" /> Sub-Department
              </label>
              <select
                name="subDepartment"
                value={formData.subDepartment}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="">Select Sub-Department</option>
                {subDepartments.map((subDept) => (
                  <option key={subDept._id} value={subDept._id}>
                    {subDept.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2 flex items-center">
              <FaStar className="mr-2 text-gray-500" /> Skills
            </label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Comma-separated skills (e.g., JavaScript, React)"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2 flex items-center">
              <FaBriefcase className="mr-2 text-gray-500" /> Position
            </label>
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-lg font-semibold hover:bg-blue-600 transition flex items-center justify-center"
          >
            <FaUserPlus className="mr-2" /> Add User
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
