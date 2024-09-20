// File: frontend/src/components/SupportTicketManagement.js

import React, { useState, useEffect } from 'react';
import { FaSpinner, FaExclamationCircle, FaTools, FaFilter, FaTicketAlt, FaCalendarAlt } from 'react-icons/fa'; 
import api from '../utils/api';
import TicketFilters from './TicketFilters';
import Sidebar from './Sidebar'; 
import { toast } from 'react-toastify';
import TicketCalendar from './TicketCalendar';
import RecentTickets from './RecentTickets';

const SupportTicketManagement = () => {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const { data } = await api.get('/support/all');
        setTickets(data);
        setFilteredTickets(data); 
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch tickets');
        toast.error('Failed to fetch tickets');
        setLoading(false);
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

  const updateTicketStatus = async (ticketId, status) => {
    try {
      await api.put(`/support/${ticketId}/status`, { status });
      toast.success(`Ticket marked as ${status}`);
      const updatedTickets = tickets.map(ticket => 
        ticket.ticketId === ticketId ? { ...ticket, status } : ticket
      );
      setTickets(updatedTickets);
      setFilteredTickets(updatedTickets); 
    } catch (error) {
      toast.error('Failed to update ticket status');
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />
      
      <div className="flex-1 p-6 bg-gray-100 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center">
            <FaTools className="mr-2" /> Support Ticket Management
          </h2>
        </div>

        {/* Ticket Filters */}
        <TicketFilters onFilter={handleFilter} />

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
        ) : filteredTickets.length === 0 ? (
          <div className="text-center text-gray-500 py-10">No tickets match the selected filters.</div>
        ) : (
          <div className="ticket-list mt-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredTickets.map(ticket => (
              <div key={ticket.ticketId} className="bg-white shadow-md rounded-lg p-6">
                <p className="text-lg font-semibold">
                  <strong>Ticket ID:</strong> {ticket.ticketId}
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Description:</strong> {ticket.description}
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Status:</strong> {ticket.status}
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Priority:</strong> {ticket.priority}
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Assigned To:</strong> {ticket.assignedTo ? ticket.assignedTo.name : 'Unassigned'}
                </p>
                <div className="flex space-x-4 mt-4">
                  <button
                    className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 transition"
                    onClick={() => updateTicketStatus(ticket.ticketId, 'In Progress')}
                  >
                    Mark In Progress
                  </button>
                  <button
                    className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition"
                    onClick={() => updateTicketStatus(ticket.ticketId, 'Closed')}
                  >
                    Mark Closed
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportTicketManagement;
