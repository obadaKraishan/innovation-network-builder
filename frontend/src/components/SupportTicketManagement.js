// File: frontend/src/components/SupportTicketManagement.js

import React, { useState, useEffect } from 'react';
import { FaSpinner, FaExclamationCircle, FaTools, FaFilter, FaTicketAlt, FaCalendarAlt, FaArrowRight, FaInfoCircle } from 'react-icons/fa'; // Added FaInfoCircle
import { useNavigate } from 'react-router-dom'; // To navigate to TicketDetails.js
import api from '../utils/api';
import Sidebar from './Sidebar'; 
import { toast } from 'react-toastify';
import Calendar from 'react-calendar'; // React Calendar library
import 'react-calendar/dist/Calendar.css'; // Calendar styles

const SupportTicketManagement = () => {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // States for calendar and filtering
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [dateFilter, setDateFilter] = useState(''); // New date filter

  const navigate = useNavigate(); // Hook to navigate to another page

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

  // Live filter handler
  useEffect(() => {
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
    if (dateFilter) {
      const now = new Date();
      filtered = filtered.filter(ticket => {
        const ticketDate = new Date(ticket.createdAt);
        if (dateFilter === 'day') {
          return ticketDate.toDateString() === now.toDateString();
        } else if (dateFilter === 'week') {
          const weekAgo = new Date(now.setDate(now.getDate() - 7));
          return ticketDate >= weekAgo;
        } else if (dateFilter === 'month') {
          const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
          return ticketDate >= monthAgo;
        } else if (dateFilter === 'year') {
          const yearAgo = new Date(now.setFullYear(now.getFullYear() - 1));
          return ticketDate >= yearAgo;
        }
        return true;
      });
    }

    setFilteredTickets(filtered);
  }, [statusFilter, priorityFilter, departmentFilter, dateFilter, tickets]);

  // Handle navigation to the TicketDetails.js page
  const goToTicketDetails = (ticketId) => {
    navigate(`/ticket-details/${ticketId}`);
  };

  // Filter tickets based on the selected date from the calendar
  const ticketsOnSelectedDate = tickets.filter(ticket => {
    const ticketDate = new Date(ticket.createdAt);
    return ticketDate.toDateString() === selectedDate.toDateString();
  });

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
        <div className="ticket-filters bg-white shadow-md rounded p-6 mb-6">
          <h3 className="text-lg font-bold mb-4 flex items-center">
            <FaFilter className="mr-2" /> Filter Tickets
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
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

            {/* Date Filter */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Date Range</label>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
              >
                <option value="">All</option>
                <option value="day">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
            </div>
          </div>
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
          <div className="ticket-list grid grid-cols-1 gap-4">
            {filteredTickets.map(ticket => (
              <div key={ticket.ticketId} className="bg-white shadow-md rounded-lg p-6 flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold">
                    <FaTicketAlt className="mr-2 text-blue-500" />
                    <strong>Ticket ID:</strong> {ticket.ticketId}
                  </p>
                  <p className="text-gray-700 mb-2">
                    <strong>Description:</strong> {ticket.description}
                  </p>
                  <p className="text-gray-700 mb-2">
                    <strong>Department:</strong> {ticket.department}
                  </p>
                  <p className="text-gray-700 mb-2">
                    <strong>Assigned To:</strong> {ticket.assignedTo ? ticket.assignedTo.name : 'Unassigned'}
                  </p>
                  <p className="text-gray-700 mb-2">
                    <strong>Created At:</strong> {new Date(ticket.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center">
                  <span className={`badge ${ticket.status === 'New' ? 'bg-blue-500' : ticket.status === 'In Progress' ? 'bg-yellow-500' : 'bg-green-500'} text-white px-3 py-1 rounded`}>
                    {ticket.status}
                  </span>
                  <span className={`badge ml-3 ${ticket.priority === 'Low' ? 'bg-green-500' : ticket.priority === 'Medium' ? 'bg-yellow-500' : 'bg-red-500'} text-white px-3 py-1 rounded`}>
                    {ticket.priority}
                  </span>
                  <button
                    className="ml-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
                    onClick={() => goToTicketDetails(ticket.ticketId)}
                  >
                    View Details <FaArrowRight className="ml-2" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Ticket Calendar Section */}
        <div className="mb-6 mt-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FaCalendarAlt className="mr-2" /> Ticket Calendar
          </h3>

          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            className="bg-white shadow-md rounded-lg p-4"
          />

          {/* Tickets on selected date */}
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <FaInfoCircle className="animate-spin text-2xl text-blue-500" />
              <span className="ml-2">Loading tickets...</span>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-10">
              <FaExclamationCircle className="inline-block mr-2" />
              {error}
            </div>
          ) : ticketsOnSelectedDate.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              <FaExclamationCircle className="inline-block mr-2" />
              No tickets for the selected date.
            </div>
          ) : (
            <div className="mt-4">
              <h3 className="text-lg font-bold mb-4 flex items-center">
                <FaTicketAlt className="mr-2" /> Tickets on {selectedDate.toDateString()}
              </h3>
              {ticketsOnSelectedDate.map(ticket => (
                <div key={ticket.ticketId} className="bg-white shadow-md rounded-lg mb-4 p-6">
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
      </div>
    </div>
  );
};

export default SupportTicketManagement;
