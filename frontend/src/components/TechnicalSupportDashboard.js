// File: frontend/src/components/TechnicalSupportDashboard.js

import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { FaTicketAlt, FaPlus, FaSearch, FaHistory } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const TechnicalSupportDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [openTickets, setOpenTickets] = useState([]);
  const [ticketHistory, setTicketHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const { data } = await api.get('/support/my-tickets');
        setTickets(data);

        // Separate tickets into open and closed (history)
        setOpenTickets(data.filter(ticket => ticket.status !== 'Closed'));
        setTicketHistory(data.filter(ticket => ticket.status === 'Closed'));
      } catch (error) {
        console.error('Failed to fetch tickets', error);
      }
    };

    fetchTickets();
  }, []);

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

        {/* Open Tickets Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FaTicketAlt className="mr-2" /> My Open Tickets
          </h3>
          {openTickets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {openTickets.map(ticket => (
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
            <p>No open tickets found.</p>
          )}
        </div>

        {/* Ticket History Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FaHistory className="mr-2" /> Ticket History
          </h3>
          {ticketHistory.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {ticketHistory.slice(0, 2).map(ticket => (
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

              {/* Show All Ticket History Button */}
              <div className="mt-4">
                <button
                  onClick={() => navigate('/ticket-history')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Show All Ticket History
                </button>
              </div>
            </>
          ) : (
            <p>No ticket history available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TechnicalSupportDashboard;
