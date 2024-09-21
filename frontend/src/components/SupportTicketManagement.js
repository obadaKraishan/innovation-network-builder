// File: frontend/src/components/SupportTicketManagement.js

import React, { useState, useEffect } from 'react';
import { FaSpinner, FaExclamationCircle, FaTools, FaFilter, FaTicketAlt, FaCalendarAlt, FaCheck, FaClock } from 'react-icons/fa';
import api from '../utils/api';
import Sidebar from './Sidebar'; 
import { toast } from 'react-toastify';

const SupportTicketManagement = () => {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentTickets, setRecentTickets] = useState([]); // State for recent tickets
  const [recentLoading, setRecentLoading] = useState(true); // Loading state for recent tickets
  const [recentError, setRecentError] = useState(null); // Error state for recent tickets

  // Filter states
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');

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

  // Fetch recent tickets
  useEffect(() => {
    const fetchRecentTickets = async () => {
      try {
        const { data } = await api.get('/support/recent-tickets');
        setRecentTickets(data);
        setRecentLoading(false);
      } catch (error) {
        setRecentError('Failed to fetch recent tickets');
        toast.error('Failed to fetch recent tickets');
        setRecentLoading(false);
      }
    };

    fetchRecentTickets();
  }, []);

  // Handle filter logic
  const handleFilterChange = () => {
    let filtered = tickets;

    if (statusFilter) {
      filtered = filtered.filter(ticket => ticket.status === statusFilter);
    }
    if (priorityFilter) {
      filtered = filtered.filter(ticket => ticket.priority === priorityFilter);
    }
    if (departmentFilter) {
      filtered = filtered.filter(ticket => ticket.department === departmentFilter);
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

        {/* Ticket Filters - integrated directly into this component */}
        <div className="ticket-filters bg-white shadow-md rounded p-6 mb-6">
          <h3 className="text-lg font-bold mb-4 flex items-center">
            <FaFilter className="mr-2" /> Filter Tickets
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
              >
                <option value="">All</option>
                <option value="New">New</option>
                <option value="In Progress">In Progress</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            {/* Priority Filter */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Priority</label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
              >
                <option value="">All</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            {/* Department Filter */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Department</label>
              <input
                type="text"
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                placeholder="Enter department name"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
          </div>

          {/* Apply Filters Button */}
          <button
            onClick={handleFilterChange}
            className="bg-blue-500 text-white py-3 px-6 rounded-lg w-full flex items-center justify-center mt-4 hover:bg-blue-600 transition"
          >
            <FaCheck className="mr-2" /> Apply Filters
          </button>
        </div>

        {/* Recent Tickets Section - moved logic here */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FaClock className="mr-2" /> Recent Tickets (Last 7 Days)
          </h3>

          {recentLoading ? (
            <div className="flex justify-center items-center py-10">
              <FaClock className="animate-spin text-2xl text-blue-500" />
              <span className="ml-2">Loading recent tickets...</span>
            </div>
          ) : recentError ? (
            <div className="text-center text-red-500 py-10">
              <FaExclamationCircle className="inline-block mr-2" />
              {recentError}
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
