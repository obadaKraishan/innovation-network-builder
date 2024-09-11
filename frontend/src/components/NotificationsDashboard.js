import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar'; // Sidebar component import
import api from '../utils/api';
import { FaBell, FaCheckCircle, FaTimesCircle, FaArrowLeft } from 'react-icons/fa';

const NotificationsDashboard = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // For back button navigation

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data } = await api.get('/notifications');
        setNotifications(data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(notifications.map((notif) => ({ ...notif, read: true })));
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  if (loading) {
    return <p>Loading notifications...</p>;
  }

  return (
    <div className="flex h-screen">
      <Sidebar /> {/* Sidebar component */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Notifications</h2>
          <button
            onClick={markAllAsRead}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Mark All as Read
          </button>
        </div>

        <button
          onClick={() => navigate(-1)} // Navigate to previous page
          className="mb-4 bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-600 transition"
        >
          <FaArrowLeft className="mr-2" /> Back
        </button>

        <ul className="space-y-4">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <li key={notification._id} className={`p-4 rounded-lg shadow-sm ${notification.read ? 'bg-gray-100' : 'bg-gray-50'}`}>
                <div className="flex justify-between">
                  <div className="flex items-center space-x-3">
                    <FaBell className={`text-xl ${notification.read ? 'text-green-600' : 'text-yellow-500'}`} />
                    <Link to={`/notifications/${notification._id}`} className="text-lg text-gray-800 hover:underline">
                      {notification.message}
                    </Link>
                  </div>
                  <div className="flex space-x-2">
                    <span className={`text-sm ${notification.read ? 'text-green-500' : 'text-yellow-500'}`}>
                      {notification.read ? <FaCheckCircle /> : <FaTimesCircle />}
                    </span>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <p>No notifications found.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default NotificationsDashboard;
