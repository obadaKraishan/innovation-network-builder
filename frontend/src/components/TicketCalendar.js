// File: frontend/src/components/TicketCalendar.js

import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaTicketAlt, FaInfoCircle, FaExclamationCircle } from 'react-icons/fa'; // Added icons
import api from '../utils/api';
import Calendar from 'react-calendar'; // React Calendar library
import 'react-calendar/dist/Calendar.css'; // Calendar styles
import { toast } from 'react-toastify'; // For notifications

const TicketCalendar = () => {
  const [tickets, setTickets] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const { data } = await api.get('/support/all');
        setTickets(data);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch tickets');
        toast.error('Failed to fetch tickets');
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const ticketsOnSelectedDate = tickets.filter(ticket => {
    const ticketDate = new Date(ticket.createdAt);
    return ticketDate.toDateString() === selectedDate.toDateString();
  });

  return (
    <div className="ticket-calendar p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <FaCalendarAlt className="mr-2" /> Ticket Calendar
      </h2>

      {/* Calendar */}
      <Calendar
        onChange={setSelectedDate}
        value={selectedDate}
        className="bg-white shadow-md rounded-lg p-4"
      />

      {/* Loading and Error States */}
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
  );
};

export default TicketCalendar;
