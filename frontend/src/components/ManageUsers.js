import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

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
    <div className="manage-users">
      <h1>Manage Users</h1>
      <div className="filters">
        <input
          type="text"
          placeholder="Search by name or email"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
        <select
          value={filters.department}
          onChange={(e) => setFilters({ ...filters, department: e.target.value })}
        >
          <option value="">All Departments</option>
          {/* Populate departments dynamically */}
        </select>
      </div>
      <div className="user-list">
        {users.map((user) => (
          <div className="user-card" key={user._id}>
            <h3>{user.name}</h3>
            <p>{user.position}</p>
            <Link to={`/manage-users/${user._id}`}>View / Edit</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageUsers;
