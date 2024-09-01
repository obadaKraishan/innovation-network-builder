import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './Sidebar'; // Import Sidebar component

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
      navigate('/manage-users');
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar /> {/* Include the Sidebar component */}
      <div className="flex-1 bg-gray-50 p-6 overflow-y-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Add New User</h1>
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg">
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
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
            <label className="block text-gray-700 font-bold mb-2">Department</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
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
              <label className="block text-gray-700 font-bold mb-2">Sub-Department</label>
              <select
                name="subDepartment"
                value={formData.subDepartment}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
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
            <label className="block text-gray-700 font-bold mb-2">Skills</label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="Comma-separated skills (e.g., JavaScript, React)"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Position</label>
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-lg font-semibold hover:bg-blue-600 transition"
          >
            Add User
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
