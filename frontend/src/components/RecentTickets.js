// File: frontend/src/components/RecentTickets.js

import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const RecentTickets = () => {
  const [recentTickets, setRecentTickets] = useState([]);

  useEffect(() => {
    const fetchRecentTickets = async () => {
      try {
        const { data } = await api.get('/support/recent-tickets');
        setRecentTickets(data);
      } catch (error) {
        console.error('Failed to fetch recent tickets', error);
      }
    };

    fetchRecentTickets();
  }, []);

  return (
    <div className="recent-tickets">
      <h2 className="text-xl font-bold mb-4">Recent Tickets (Last 7 Days)</h2>
      <div className="ticket-list">
        {recentTickets.length > 0 ? (
          recentTickets.map(ticket => (
            <div key={ticket.ticketId} className="bg-white shadow-md rounded mb-4 p-4">
              <p><strong>Ticket ID:</strong> {ticket.ticketId}</p>
              <p><strong>Description:</strong> {ticket.description}</p>
              <p><strong>Status:</strong> {ticket.status}</p>
              <p><strong>Priority:</strong> {ticket.priority}</p>
              <p><strong>Created At:</strong> {new Date(ticket.createdAt).toLocaleDateString()}</p>
            </div>
          ))
        ) : (
          <p>No recent tickets available.</p>
        )}
      </div>
    </div>
  );
};

export default RecentTickets;
