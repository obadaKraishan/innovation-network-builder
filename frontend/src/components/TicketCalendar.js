// File: frontend/src/components/TicketCalendar.js

import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Calendar from 'react-calendar'; // React Calendar library
import 'react-calendar/dist/Calendar.css'; // Calendar styles

const TicketCalendar = () => {
  const [tickets, setTickets] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const { data } = await api.get('/support/all');
        setTickets(data);
      } catch (error) {
        console.error('Failed to fetch tickets');
      }
    };

    fetchTickets();
  }, []);

  const ticketsOnSelectedDate = tickets.filter(ticket => {
    const ticketDate = new Date(ticket.createdAt);
    return ticketDate.toDateString() === selectedDate.toDateString();
  });

  return (
    <div className="ticket-calendar">
      <h2 className="text-xl font-bold mb-4">Ticket Calendar</h2>

      <Calendar
        onChange={setSelectedDate}
        value={selectedDate}
        className="bg-white shadow-md rounded p-4"
      />

      <div className="mt-4">
        <h3 className="text-lg font-bold">Tickets on {selectedDate.toDateString()}:</h3>
        {ticketsOnSelectedDate.length > 0 ? (
          ticketsOnSelectedDate.map(ticket => (
            <div key={ticket.ticketId} className="bg-white shadow-md rounded mb-4 p-4">
              <p><strong>Ticket ID:</strong> {ticket.ticketId}</p>
              <p><strong>Description:</strong> {ticket.description}</p>
              <p><strong>Status:</strong> {ticket.status}</p>
              <p><strong>Priority:</strong> {ticket.priority}</p>
            </div>
          ))
        ) : (
          <p>No tickets for the selected date.</p>
        )}
      </div>
    </div>
  );
};

export default TicketCalendar;
