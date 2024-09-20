// File: frontend/src/components/TicketHistory.js

import React, { useState, useEffect } from 'react';
import { FaFilter, FaSpinner, FaExclamationCircle, FaArrowLeft } from 'react-icons/fa'; // Added icons
import { useNavigate } from 'react-router-dom'; // Navigation for back button
import Sidebar from './Sidebar'; // Sidebar component
import api from '../utils/api';
import { toast } from 'react-toastify';

const TicketHistory = () => {
  const [tickets, setTickets] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // For back button navigation

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const { data } = await api.get('/support/my-tickets');
        setTickets(data);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch ticket history');
        toast.error('Failed to fetch ticket history');
        setLoading(false);
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
    setTickets(filtered);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      <div className="flex-1 p-6 bg-gray-100 overflow-y-auto">
        {/* Back Button */}
        <button onClick={() => navigate(-1)} className="mb-4 bg-blue-500 text-white py-2 px-4 rounded-lg flex items-center">
          <FaArrowLeft className="mr-2" /> Back
        </button>

        {/* Ticket History */}
        <h2 className="text-2xl font-bold mb-4">Ticket History</h2>

        {/* Filter Options */}
        <div className="filters mb-4 p-4 bg-white shadow-md rounded-lg flex space-x-4 items-center">
          <FaFilter className="text-gray-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            <option value="">All Statuses</option>
            <option value="New">New</option>
            <option value="In Progress">In Progress</option>
            <option value="Closed">Closed</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            <option value="">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          <button
            onClick={handleFilter}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Apply Filters
          </button>
        </div>

        {/* Loading and Error States */}
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <FaSpinner className="animate-spin text-2xl text-blue-500" />
            <span className="ml-2">Loading tickets...</span>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-10">
            <FaExclamationCircle className="inline-block mr-2" />
            {error}
          </div>
        ) : tickets.length === 0 ? (
          <div className="text-center text-gray-500 py-10">No tickets available.</div>
        ) : (
          <div>
            {tickets.map((ticket) => (
              <div key={ticket.ticketId} className="bg-white shadow-md rounded-lg p-6 mb-4">
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
        )}
      </div>
    </div>
  );
};

export default TicketHistory;
