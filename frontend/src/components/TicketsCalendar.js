import React, { useState, useEffect } from 'react';
import { FaSpinner, FaCalendarAlt, FaExclamationCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-toastify';
import Sidebar from './Sidebar'; // Sidebar component
import FullCalendar from '@fullcalendar/react'; // FullCalendar library
import dayGridPlugin from '@fullcalendar/daygrid'; // For the day grid
import timeGridPlugin from '@fullcalendar/timegrid'; // For time grid
import interactionPlugin from '@fullcalendar/interaction'; // For clickable events

const TicketsCalendar = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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

  // Handle navigation to the TicketDetails.js page
  const goToTicketDetails = (ticketId) => {
    navigate(`/ticket-details/${ticketId}`);
  };

  // Map tickets to calendar events
  const calendarEvents = tickets.map(ticket => ({
    title: `Ticket: ${ticket.ticketId} - ${ticket.priority} Priority`,
    start: new Date(ticket.createdAt), // Event start time is ticket creation date
    allDay: true,
    extendedProps: {
      ticketId: ticket.ticketId,  // Ensure the ticketId is included in extendedProps
      description: ticket.description,
      status: ticket.status,
      department: ticket.department,
      assignedTo: ticket.assignedTo ? ticket.assignedTo.name : 'Unassigned',
    },
  }));

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      <div className="flex-1 p-6 bg-gray-100 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center">
            <FaCalendarAlt className="mr-2" /> Ticket Calendar
          </h2>
        </div>

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
        ) : (
          <div className="calendar-section bg-white shadow-md rounded p-6 mt-6 mb-6">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              events={calendarEvents}
              eventClick={(info) => goToTicketDetails(info.event.extendedProps.ticketId)} // Pass ticketId correctly
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay',
              }}
              height="auto"
              eventContent={(eventInfo) => (
                <div>
                  <strong>{eventInfo.event.title}</strong>
                  <br />
                  <span>Status: {eventInfo.event.extendedProps.status}</span>
                  <br />
                  <span>Assigned To: {eventInfo.event.extendedProps.assignedTo}</span>
                </div>
              )}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketsCalendar;
