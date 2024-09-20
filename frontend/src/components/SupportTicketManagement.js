// File: frontend/src/components/SupportTicketManagement.js

import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import TicketFilters from './TicketFilters';

const SupportTicketManagement = () => {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const { data } = await api.get('/support/all');
        setTickets(data);
        setFilteredTickets(data); // Initialize filtered tickets
      } catch (error) {
        console.error('Failed to fetch tickets', error);
      }
    };

    fetchTickets();
  }, []);

  const handleFilter = (filters) => {
    let filtered = tickets;

    if (filters.status) {
      filtered = filtered.filter(ticket => ticket.status === filters.status);
    }
    if (filters.priority) {
      filtered = filtered.filter(ticket => ticket.priority === filters.priority);
    }
    if (filters.department) {
      filtered = filtered.filter(ticket => ticket.department === filters.department);
    }

    setFilteredTickets(filtered);
  };

  return (
    <div className="support-ticket-management">
      <h2 className="text-xl font-bold mb-4">Support Ticket Management</h2>

      <TicketFilters onFilter={handleFilter} />

      <div className="ticket-list mt-4">
        {filteredTickets.map(ticket => (
          <div key={ticket.ticketId} className="bg-white shadow-md rounded mb-4 p-4">
            <p><strong>Ticket ID:</strong> {ticket.ticketId}</p>
            <p><strong>Description:</strong> {ticket.description}</p>
            <p><strong>Status:</strong> {ticket.status}</p>
            <p><strong>Priority:</strong> {ticket.priority}</p>
            <p><strong>Assigned To:</strong> {ticket.assignedTo ? ticket.assignedTo.name : 'Unassigned'}</p>
            <button
              className="bg-yellow-500 text-white py-2 px-4 rounded mr-2"
              onClick={() => updateTicketStatus(ticket.ticketId, 'In Progress')}
            >
              Mark In Progress
            </button>
            <button
              className="bg-green-500 text-white py-2 px-4 rounded"
              onClick={() => updateTicketStatus(ticket.ticketId, 'Closed')}
            >
              Mark Closed
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SupportTicketManagement;
