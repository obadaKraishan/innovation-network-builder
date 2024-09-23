import React, { useState, useEffect } from 'react';
import { FaSpinner, FaExclamationCircle, FaArrowLeft, FaFilter, FaTicketAlt, FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Sidebar from './Sidebar'; 
import { toast } from 'react-toastify';

const OpenTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ticketsPerPage = 10; // Number of tickets per page
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // States for filtering and search
  const [priorityFilter, setPriorityFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const navigate = useNavigate();

  // Fetch tickets with status 'New'
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const { data } = await api.get('/support/all');
        const newTickets = data.filter(ticket => ticket.status === 'New');
        setTickets(newTickets);
        setFilteredTickets(newTickets);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch tickets');
        toast.error('Failed to fetch tickets');
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  // Apply filters and search
  useEffect(() => {
    let filtered = tickets;

    if (priorityFilter) {
      filtered = filtered.filter(ticket => ticket.priority === priorityFilter);
    }
    if (departmentFilter) {
      filtered = filtered.filter(ticket => ticket.department.toLowerCase().includes(departmentFilter.toLowerCase()));
    }
    if (searchTerm) {
      filtered = filtered.filter(ticket =>
        ticket.ticketId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredTickets(filtered);
  }, [priorityFilter, departmentFilter, searchTerm, tickets]);

  // Pagination Logic
  const indexOfLastTicket = currentPage * ticketsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
  const currentTickets = filteredTickets.slice(indexOfFirstTicket, indexOfLastTicket);
  const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage);

  // Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Navigate to TicketDetails.js
  const goToTicketDetails = (ticketId) => {
    navigate(`/ticket-details/${ticketId}`);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      <div className="flex-1 p-6 bg-gray-100 overflow-auto">
        {/* Back Button */}
        <button
          className="mb-6 flex items-center bg-gray-200 p-3 rounded hover:bg-gray-300"
          onClick={() => navigate('/support-management')}
        >
          <FaArrowLeft className="mr-2" /> Back to Support Ticket Management
        </button>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center">
            <FaTicketAlt className="mr-2" /> Open Tickets (New Status)
          </h2>
        </div>

        {/* Ticket Filters */}
        <div className="ticket-filters bg-white shadow-md rounded p-6 mb-6">
          <h3 className="text-lg font-bold mb-4 flex items-center">
            <FaFilter className="mr-2" /> Filter Tickets
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
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

            {/* Search Bar */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Search</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by Ticket ID or Description"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
          </div>
        </div>

        {/* Filtered Ticket List */}
        <div className="ticket-list grid grid-cols-1 gap-4">
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
          ) : currentTickets.length === 0 ? (
            <div className="text-center text-gray-500 py-10">No tickets match the selected filters.</div>
          ) : (
            currentTickets.map(ticket => (
              <div key={ticket.ticketId} className="bg-white shadow-md rounded-lg p-6 relative">
                {/* Badges for Priority */}
                <div className="absolute top-2 right-2 flex space-x-2">
                  <span className={`badge ${ticket.priority === 'Low' ? 'bg-green-500' : ticket.priority === 'Medium' ? 'bg-yellow-500' : 'bg-red-500'} text-white px-3 py-1 rounded`}>
                    {ticket.priority}
                  </span>
                </div>

                {/* Ticket Information */}
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
                    <strong>Created At:</strong> {new Date(ticket.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {/* View Details Button */}
                <div className="flex justify-end">
                  <button
                    className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition flex items-center"
                    onClick={() => goToTicketDetails(ticket.ticketId)}
                  >
                    View Details <FaArrowRight className="ml-2" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {filteredTickets.length > ticketsPerPage && (
          <ul className="paginationBtns">
            {[...Array(totalPages)].map((_, index) => (
              <li key={index} className={currentPage === index + 1 ? 'paginationActive' : ''}>
                <a onClick={() => paginate(index + 1)}>{index + 1}</a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default OpenTickets;
