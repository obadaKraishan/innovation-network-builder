// File: frontend/src/components/ManageUsers.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './Sidebar'; // Import Sidebar component

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ department: '', search: '' });

  useEffect(() => {
    // Fetch users from the backend
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/users/manage-users', { params: filters });
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, [filters]);

  return (
    <div className="flex h-screen">
      <Sidebar /> {/* Include the Sidebar component */}
      <div className="flex-1 bg-gray-50 p-6 overflow-y-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Manage Users</h1>
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <div className="mb-6 flex items-center space-x-4">
            <input
              type="text"
              placeholder="Search by name or email"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500"
            />
            <select
              value={filters.department}
              onChange={(e) => setFilters({ ...filters, department: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500"
            >
              <option value="">All Departments</option>
              {/* Dynamically populate department options */}
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <div key={user._id} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{user.name}</h3>
                <p className="text-gray-600 mb-4"><strong>Position:</strong> {user.position}</p>
                <Link
                  to={`/manage-users/${user._id}`}
                  className="block w-full bg-blue-500 text-white p-3 rounded-lg font-semibold text-center hover:bg-blue-600 transition"
                >
                  View / Edit
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
