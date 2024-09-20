// File: frontend/src/components/RecentTickets.js

import React, { useState, useEffect } from 'react';
import { FaTicketAlt, FaExclamationCircle, FaClock } from 'react-icons/fa'; // Added icons
import api from '../utils/api';
import { toast } from 'react-toastify'; // For notifications

const RecentTickets = () => {
  const [recentTickets, setRecentTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecentTickets = async () => {
      try {
        const { data } = await api.get('/support/recent-tickets');
        setRecentTickets(data);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch recent tickets');
        toast.error('Failed to fetch recent tickets');
        setLoading(false);
      }
    };

    fetchRecentTickets();
  }, []);

  return (
    <div className="recent-tickets p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <FaClock className="mr-2" /> Recent Tickets (Last 7 Days)
      </h2>

      {/* Loading and Error States */}
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <FaClock className="animate-spin text-2xl text-blue-500" />
          <span className="ml-2">Loading recent tickets...</span>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 py-10">
          <FaExclamationCircle className="inline-block mr-2" />
          {error}
        </div>
      ) : recentTickets.length === 0 ? (
        <div className="text-center text-gray-500 py-10">
          <FaExclamationCircle className="inline-block mr-2" />
          No recent tickets available.
        </div>
      ) : (
        <div className="ticket-list grid grid-cols-1 md:grid-cols-2 gap-6">
          {recentTickets.map(ticket => (
            <div key={ticket.ticketId} className="bg-white shadow-md rounded-lg p-6">
              <p className="text-lg font-semibold">
                <FaTicketAlt className="inline-block mr-2 text-blue-500" />
                Ticket ID: {ticket.ticketId}
              </p>
              <p className="text-gray-600">
                <strong>Description:</strong> {ticket.description}
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

export default RecentTickets;
