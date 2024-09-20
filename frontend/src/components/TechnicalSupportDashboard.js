// File: frontend/src/components/TechnicalSupportDashboard.js

import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { FaArrowLeft, FaTicketAlt, FaCalendarAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import RecentTickets from './RecentTickets';
import TicketCalendar from './TicketCalendar';
import api from '../utils/api';

const TechnicalSupportDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const { data } = await api.get('/support/all');
        setTickets(data);
      } catch (error) {
        console.error('Failed to fetch tickets', error);
      }
    };

    fetchTickets();
  }, []);

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
      </div>
    </div>
  );
};

export default TechnicalSupportDashboard;
