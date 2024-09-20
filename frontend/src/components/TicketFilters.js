// File: frontend/src/components/TicketFilters.js

import React, { useState } from 'react';
import { FaFilter, FaCheck } from 'react-icons/fa'; // Icons for better UX

const TicketFilters = ({ onFilter }) => {
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [department, setDepartment] = useState('');

  const handleFilterChange = () => {
    onFilter({
      status,
      priority,
      department,
    });
  };

  return (
    <div className="ticket-filters bg-white shadow-md rounded p-6">
      <h3 className="text-lg font-bold mb-4 flex items-center">
        <FaFilter className="mr-2" /> Filter Tickets
      </h3>

      {/* Status Filter */}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
        >
          <option value="">All</option>
          <option value="New">New</option>
          <option value="In Progress">In Progress</option>
          <option value="Closed">Closed</option>
        </select>
      </div>

      {/* Priority Filter */}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">Priority</label>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
        >
          <option value="">All</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      {/* Department Filter */}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">Department</label>
        <input
          type="text"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          placeholder="Enter department name"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
        />
      </div>

      {/* Apply Filters Button */}
      <button
        onClick={handleFilterChange}
        className="bg-blue-500 text-white py-3 px-6 rounded-lg w-full flex items-center justify-center hover:bg-blue-600 transition"
      >
        <FaCheck className="mr-2" /> Apply Filters
      </button>
    </div>
  );
};

export default TicketFilters;
