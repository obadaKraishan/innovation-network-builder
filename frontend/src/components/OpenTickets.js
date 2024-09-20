// File: frontend/src/components/OpenTickets.js

import React, { useState, useEffect } from 'react';
import { FaTicketAlt, FaInfoCircle, FaExclamationCircle } from 'react-icons/fa'; // Added icons
import api from '../utils/api';
import { toast } from 'react-toastify';

const OpenTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOpenTickets = async () => {
      try {
        const { data } = await api.get('/support/my-tickets');
        const openTickets = data.filter((ticket) => ticket.status === 'Open');
        setTickets(openTickets);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch open tickets');
        toast.error('Failed to fetch open tickets');
        setLoading(false);
      }
    };

    fetchOpenTickets();
  }, []);

  return (
    <div className="open-tickets p-6 bg-gray-100">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <FaTicketAlt className="mr-2" /> Open Tickets
      </h2>

      {/* Loading and Error States */}
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <FaInfoCircle className="animate-spin text-2xl text-blue-500" />
          <span className="ml-2">Loading open tickets...</span>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 py-10">
          <FaExclamationCircle className="inline-block mr-2" />
          {error}
        </div>
      ) : tickets.length === 0 ? (
        <div className="text-center text-gray-500 py-10">No open tickets available.</div>
      ) : (
        <div>
          {tickets.map((ticket) => (
            <div key={ticket.ticketId} className="bg-white shadow-md rounded-lg p-6 mb-4">
              <p className="text-lg font-semibold">
                <FaTicketAlt className="inline-block mr-2 text-blue-500" />
                Ticket ID: {ticket.ticketId}
              </p>
              <p className="text-gray-600">
                <strong>Status:</strong> {ticket.status}
              </p>
              <p className="text-gray-600">
                <strong>Priority:</strong> {ticket.priority}
              </p>
              <p className="text-gray-600">
                <strong>Created At:</strong> {new Date(ticket.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OpenTickets;
