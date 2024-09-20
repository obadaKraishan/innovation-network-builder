// File: frontend/src/components/TicketFilters.js

import React, { useState } from 'react';

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
    <div className="ticket-filters bg-white shadow-md rounded p-4">
      <h3 className="text-lg font-bold mb-4">Filter Tickets</h3>

      <div className="mb-4">
        <label className="block text-gray-700">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">All</option>
          <option value="New">New</option>
          <option value="In Progress">In Progress</option>
          <option value="Closed">Closed</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Priority</label>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">All</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Department</label>
        <input
          type="text"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          placeholder="Enter department name"
          className="w-full p-2 border rounded"
        />
      </div>

      <button
        onClick={handleFilterChange}
        className="bg-blue-500 text-white py-2 px-4 rounded"
      >
        Apply Filters
      </button>
    </div>
  );
};

export default TicketFilters;
