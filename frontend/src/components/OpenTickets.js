// File: frontend/src/components/OpenTickets.js

import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const OpenTickets = () => {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const fetchOpenTickets = async () => {
      try {
        const { data } = await api.get('/support/my-tickets');
        const openTickets = data.filter((ticket) => ticket.status === 'Open');
        setTickets(openTickets);
      } catch (error) {
        console.error('Failed to fetch open tickets');
      }
    };

    fetchOpenTickets();
  }, []);

  return (
    <div className="open-tickets">
      <h2 className="text-xl font-bold mb-4">Open Tickets</h2>
      <div>
        {tickets.length > 0 ? (
          tickets.map((ticket) => (
            <div key={ticket.ticketId} className="bg-white shadow-md rounded mb-4 p-4">
              <p>
                <strong>Ticket ID:</strong> {ticket.ticketId}
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
          ))
        ) : (
          <p>No open tickets available.</p>
        )}
      </div>
    </div>
  );
};

export default OpenTickets;
