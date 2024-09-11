import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { FaBell, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const NotificationsDashboard = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

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
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Notifications</h2>
        <button
          onClick={markAllAsRead}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Mark All as Read
        </button>
      </div>

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
  );
};

export default NotificationsDashboard;
