// File: frontend/src/components/TechnicalSupportDashboard.js

import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import TicketFilters from './TicketFilters';
import RecentTickets from './RecentTickets';
import TicketCalendar from './TicketCalendar';

const TechnicalSupportDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const { data } = await api.get('/support/all'); // Fetch all tickets
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
    <div className="technical-support-dashboard">
      <h2 className="text-xl font-bold mb-4">Technical Support Dashboard</h2>

      {/* Ticket Filters */}
      <TicketFilters onFilter={handleFilter} />

      {/* Recent Tickets */}
      <div className="mt-8">
        <RecentTickets />
      </div>

      {/* Ticket Calendar */}
      <div className="mt-8">
        <TicketCalendar />
      </div>

      {/* Filtered Tickets */}
      <div className="filtered-tickets mt-8">
        <h3 className="text-lg font-bold mb-4">Filtered Tickets</h3>
        <div className="ticket-list">
          {filteredTickets.length > 0 ? (
            filteredTickets.map(ticket => (
              <div key={ticket.ticketId} className="bg-white shadow-md rounded mb-4 p-4">
                <p><strong>Ticket ID:</strong> {ticket.ticketId}</p>
                <p><strong>Description:</strong> {ticket.description}</p>
                <p><strong>Status:</strong> {ticket.status}</p>
                <p><strong>Priority:</strong> {ticket.priority}</p>
                <p><strong>Department:</strong> {ticket.department}</p>
                <p><strong>Created At:</strong> {new Date(ticket.createdAt).toLocaleDateString()}</p>
              </div>
            ))
          ) : (
            <p>No tickets match the selected filters.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TechnicalSupportDashboard;
