// File: frontend/src/components/TicketHistory.js

import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const TicketHistory = () => {
  const [tickets, setTickets] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const { data } = await api.get('/support/my-tickets');
        setTickets(data);
      } catch (error) {
        console.error('Failed to fetch ticket history');
      }
    };

    fetchTickets();
  }, []);

  const handleFilter = () => {
    let filtered = tickets;
    if (statusFilter) {
      filtered = filtered.filter((ticket) => ticket.status === statusFilter);
    }
    if (priorityFilter) {
      filtered = filtered.filter((ticket) => ticket.priority === priorityFilter);
    }
    // Add date filtering logic if necessary
    setTickets(filtered);
  };

  return (
    <div className="ticket-history">
      <h2 className="text-xl font-bold mb-4">Ticket History</h2>
      <div className="filters mb-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="mr-4"
        >
          <option value="">All Statuses</option>
          <option value="Open">Open</option>
          <option value="Closed">Closed</option>
        </select>
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="mr-4"
        >
          <option value="">All Priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <button onClick={handleFilter} className="bg-blue-500 text-white py-2 px-4 rounded">
          Filter
        </button>
      </div>
      <div>
        {tickets.map((ticket) => (
          <div key={ticket.ticketId} className="bg-white shadow-md rounded mb-4 p-4">
            <p>
              <strong>Ticket ID:</strong> {ticket.ticketId}
            </p>
            <p>
              <strong>Description:</strong> {ticket.description}
            </p>
            <p>
              <strong>Status:</strong> {ticket.status}
            </p>
            <p>
              <strong>Priority:</strong> {ticket.priority}
            </p>
            <p>
              <strong>Created At:</strong> {new Date(ticket.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TicketHistory;
