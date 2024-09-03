import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import api from '../utils/api';
import { FaPlus, FaCog } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';

const MeetingBooking = () => {
  const [bookings, setBookings] = useState({ bookedWithOthers: [], bookedByOthers: [] });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        // Retrieve user ID from local storage (if you have saved it as 'userInfo' earlier)
        const user = JSON.parse(localStorage.getItem('userInfo'));
        const userId = user?._id;

        if (!userId) {
          throw new Error('User ID not found.');
        }

        // Fetch bookings related to the user
        const { data } = await api.get('/booking', { params: { userId } });
        setBookings(data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        toast.error('Failed to fetch bookings.');
      }
    };
    fetchBookings();
  }, []);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100">
        <ToastContainer />

        <h2 className="text-3xl font-semibold mb-6">My Meetings</h2>
        <div className="flex justify-between mb-6">
          <button
            onClick={() => navigate('/book-meeting')}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg flex items-center hover:bg-blue-600 transition"
          >
            <FaPlus className="mr-2" /> Create New Meeting
          </button>
          <button
            onClick={() => navigate('/meeting-availability')}
            className="bg-gray-500 text-white px-6 py-3 rounded-lg flex items-center hover:bg-gray-600 transition"
          >
            <FaCog className="mr-2" /> Update Availability
          </button>
        </div>

        <h3 className="text-xl font-semibold mb-4">Meetings I Have Booked with Others</h3>
        {bookings.bookedWithOthers.length > 0 ? (
          <ul>
            {bookings.bookedWithOthers.map((booking) => (
              <li key={booking._id} className="mb-4 p-4 bg-white rounded-lg shadow-lg">
                <p><strong>Date:</strong> {booking.date}</p>
                <p><strong>Time:</strong> {booking.time}</p>
                <p><strong>With:</strong> {booking.user.name}</p>
                <p><strong>Department:</strong> {booking.user.department.name}</p>
                <p><strong>Position:</strong> {booking.user.position}</p>
                <p><strong>Zoom Link:</strong> {booking.user.zoomLink}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No meetings booked with others.</p>
        )}

        <h3 className="text-xl font-semibold mt-8 mb-4">Meetings Others Have Booked with Me</h3>
        {bookings.bookedByOthers.length > 0 ? (
          <ul>
            {bookings.bookedByOthers.map((booking) => (
              <li key={booking._id} className="mb-4 p-4 bg-white rounded-lg shadow-lg">
                <p><strong>Date:</strong> {booking.date}</p>
                <p><strong>Time:</strong> {booking.time}</p>
                <p><strong>Booked By:</strong> {booking.bookedBy.name}</p>
                <p><strong>Department:</strong> {booking.bookedBy.department.name}</p>
                <p><strong>Position:</strong> {booking.bookedBy.position}</p>
                <p><strong>Zoom Link:</strong> {booking.bookedBy.zoomLink}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No meetings booked by others.</p>
        )}
      </div>
    </div>
  );
};

export default MeetingBooking;
