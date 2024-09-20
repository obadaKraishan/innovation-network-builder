// File: frontend/src/components/TechnicalSupportDashboard.js

import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { FaArrowLeft, FaFilter, FaCalendarAlt, FaTicketAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import TicketFilters from './TicketFilters';
import RecentTickets from './RecentTickets';
import TicketCalendar from './TicketCalendar';
import api from '../utils/api';

const TechnicalSupportDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const navigate = useNavigate();

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
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-100 overflow-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg flex items-center mb-6 hover:bg-gray-400"
        >
          <FaArrowLeft className="mr-2" /> Back
        </button>

        {/* Dashboard Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Technical Support Dashboard</h1>
        </div>

        {/* Ticket Filters */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FaFilter className="mr-2" /> Filter Tickets
          </h3>
          <TicketFilters onFilter={handleFilter} />
        </div>

        {/* Recent Tickets Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FaTicketAlt className="mr-2" /> Recent Tickets
          </h3>
          <RecentTickets />
        </div>

        {/* Ticket Calendar Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FaCalendarAlt className="mr-2" /> Ticket Calendar
          </h3>
          <TicketCalendar />
        </div>

        {/* Filtered Tickets Section */}
        <div className="mt-8">
          <h3 className="text-lg font-bold mb-4">Filtered Tickets</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredTickets.length > 0 ? (
              filteredTickets.map(ticket => (
                <div key={ticket.ticketId} className="bg-white shadow-md rounded-lg p-4">
                  <p className="text-gray-600 mb-2">
                    <strong>Ticket ID:</strong> {ticket.ticketId}
                  </p>
                  <p className="text-gray-600 mb-2">
                    <strong>Description:</strong> {ticket.description}
                  </p>
                  <p className="text-gray-600 mb-2">
                    <strong>Status:</strong> {ticket.status}
                  </p>
                  <p className="text-gray-600 mb-2">
                    <strong>Priority:</strong> {ticket.priority}
                  </p>
                  <p className="text-gray-600 mb-2">
                    <strong>Department:</strong> {ticket.department}
                  </p>
                  <p className="text-gray-600 mb-2">
                    <strong>Created At:</strong> {new Date(ticket.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <p>No tickets match the selected filters.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicalSupportDashboard;
