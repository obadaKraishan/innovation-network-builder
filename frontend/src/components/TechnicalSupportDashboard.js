// File: frontend/src/components/TechnicalSupportDashboard.js

import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { FaTicketAlt, FaPlus, FaSearch, FaHistory } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const TechnicalSupportDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const { data } = await api.get('/support/my-tickets'); // Ensure this is the right endpoint
        setTickets(data);
        setFilteredTickets(data); // Initialize with all tickets
      } catch (error) {
        console.error('Failed to fetch tickets', error);
      }
    };
  
    fetchTickets();
  }, []);  

  // Live filtering function
  useEffect(() => {
    let filtered = tickets;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter((ticket) =>
        ticket.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter((ticket) => ticket.status === statusFilter);
    }

    // Apply priority filter
    if (priorityFilter) {
      filtered = filtered.filter((ticket) => ticket.priority === priorityFilter);
    }

    // Apply date range filter
    if (dateRange.start && dateRange.end) {
      filtered = filtered.filter((ticket) => {
        const ticketDate = new Date(ticket.createdAt);
        return (
          ticketDate >= new Date(dateRange.start) &&
          ticketDate <= new Date(dateRange.end)
        );
      });
    }

    setFilteredTickets(filtered);
  }, [searchQuery, statusFilter, priorityFilter, dateRange, tickets]);

  // Helper function to render badges for status
  const renderStatusBadge = (status) => {
    let badgeColor = 'bg-gray-500'; // Default color

    if (status === 'New') badgeColor = 'bg-blue-500';
    else if (status === 'In Progress') badgeColor = 'bg-yellow-500';
    else if (status === 'Closed') badgeColor = 'bg-red-500';

    return (
      <span className={`text-white px-2 py-1 rounded-lg text-sm ${badgeColor}`}>
        {status}
      </span>
    );
  };

  // Helper function to render badges for priority
  const renderPriorityBadge = (priority) => {
    let badgeColor = 'bg-gray-500'; // Default color

    if (priority === 'High') badgeColor = 'bg-red-500';
    else if (priority === 'Medium') badgeColor = 'bg-yellow-500';
    else if (priority === 'Low') badgeColor = 'bg-green-500';

    return (
      <span className={`text-white px-2 py-1 rounded-lg text-sm ${badgeColor}`}>
        {priority}
      </span>
    );
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-100 overflow-auto">
        {/* Dashboard Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Technical Support Dashboard</h1>

          <div className="flex space-x-4">
            {/* Button to create a new ticket */}
            <button
              onClick={() => navigate('/submit-ticket')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700"
            >
              <FaPlus className="mr-2" /> Create Ticket
            </button>

            {/* Button to go to Ticket History */}
            <button
              onClick={() => navigate('/ticket-history')}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-gray-700"
            >
              <FaHistory className="mr-2" /> Ticket History
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex space-x-4 mb-6">
          {/* Filters Container */}
          <div className="flex space-x-4 w-1/2">
            {/* Status Filter */}
            <select
              className="bg-white shadow-md rounded-lg p-2 flex-1"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="New">New</option>
              <option value="In Progress">In Progress</option>
              <option value="Closed">Closed</option>
            </select>

            {/* Priority Filter */}
            <select
              className="bg-white shadow-md rounded-lg p-2 flex-1"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Date Range Filter */}
          <div className="flex space-x-4 w-1/2">
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="bg-white shadow-md rounded-lg p-2 flex-1"
            />
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="bg-white shadow-md rounded-lg p-2 flex-1"
            />
          </div>

          {/* Search Container */}
          <div className="flex items-center bg-white shadow-md rounded-lg p-2 w-1/2">
            <FaSearch className="text-gray-600 mr-2" />
            <input
              type="text"
              placeholder="Search tickets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 outline-none"
            />
          </div>
        </div>

        {/* My Tickets Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FaTicketAlt className="mr-2" /> My Tickets
          </h3>
          {filteredTickets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredTickets.map(ticket => (
                <div key={ticket.ticketId} className="bg-white shadow-md rounded-lg p-4">
                  <p className="text-gray-600 mb-2">
                    <strong>Ticket ID:</strong> {ticket.ticketId}
                  </p>
                  <p className="text-gray-600 mb-2">
                    <strong>Description:</strong> {ticket.description}
                  </p>
                  <div className="flex items-center space-x-2 mb-2">
                    <strong>Status:</strong> {renderStatusBadge(ticket.status)}
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <strong>Priority:</strong> {renderPriorityBadge(ticket.priority)}
                  </div>
                  <p className="text-gray-600 mb-2">
                    <strong>Created At:</strong> {new Date(ticket.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p>No tickets found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TechnicalSupportDashboard;
