import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './Sidebar'; // Import Sidebar component
import { FaPlus, FaSearch, FaUserEdit, FaUsers } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]); // State to store departments
  const [filters, setFilters] = useState({ department: '', search: '' });
  const navigate = useNavigate();

  // Fetch users from the backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token'); // Get token from localStorage
        const config = {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the request headers
          },
          params: filters,
        };

        const response = await axios.get('http://localhost:5001/api/users/manage-users', config);
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Error fetching users');
      }
    };
    fetchUsers();
  }, [filters]);

  // Fetch departments from the backend
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const token = localStorage.getItem('token'); // Get token from localStorage
        const config = {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the request headers
          },
        };

        const response = await axios.get('http://localhost:5001/api/departments', config);
        setDepartments(response.data);
      } catch (error) {
        console.error('Error fetching departments:', error);
        toast.error('Error fetching departments');
      }
    };
    fetchDepartments();
  }, []);

  return (
    <div className="flex h-screen">
      <Sidebar /> {/* Include the Sidebar component */}
      <div className="flex-1 bg-gray-50 p-6 overflow-y-auto">
        <ToastContainer />
        <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
          <FaUsers className="mr-2 text-blue-500" /> Manage Users
        </h1>
        <div className="mb-4 flex justify-end">
          <button
            onClick={() => navigate('/add-user')}
            className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center shadow-md hover:bg-green-600 transition"
          >
            <FaPlus className="mr-2" /> Add User
          </button>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <div className="mb-6 flex items-center space-x-4">
            <div className="flex items-center w-full">
              <FaSearch className="absolute ml-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:border-blue-500"
              />
            </div>
            <select
              value={filters.department}
              onChange={(e) => setFilters({ ...filters, department: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500"
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept._id} value={dept._id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <div key={user._id} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{user.name}</h3>
                <p className="text-gray-600 mb-4"><strong>Position:</strong> {user.position}</p>
                <Link
                  to={`/manage-users/${user._id}`}
                  className="block w-full bg-blue-500 text-white p-3 rounded-lg font-semibold text-center flex items-center justify-center hover:bg-blue-600 transition"
                >
                  <FaUserEdit className="mr-2" /> View / Edit
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
