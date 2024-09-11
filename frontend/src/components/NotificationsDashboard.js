import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import api from '../utils/api';
import { FaBell, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import Select from 'react-select';

const NotificationsDashboard = () => {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState(null);
  const [filterReadStatus, setFilterReadStatus] = useState(null);

  const notificationTypeOptions = [
    { value: 'info', label: 'Info' },
    { value: 'warning', label: 'Warning' },
    { value: 'success', label: 'Success' },
    { value: 'error', label: 'Error' },
  ];

  const readStatusOptions = [
    { value: 'read', label: 'Read' },
    { value: 'unread', label: 'Unread' },
  ];

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data } = await api.get('/notifications');
        setNotifications(data);
        setFilteredNotifications(data);
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

  // Search handler
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    applyFilters(value, filterType, filterReadStatus);
  };

  // Filter handler
  const handleFilterTypeChange = (selectedOption) => {
    setFilterType(selectedOption);
    applyFilters(searchTerm, selectedOption, filterReadStatus);
  };

  const handleFilterReadStatusChange = (selectedOption) => {
    setFilterReadStatus(selectedOption);
    applyFilters(searchTerm, filterType, selectedOption);
  };

  const applyFilters = (searchTerm, filterType, filterReadStatus) => {
    let filtered = notifications;

    if (searchTerm) {
      filtered = filtered.filter((notification) =>
        notification.message.toLowerCase().includes(searchTerm)
      );
    }

    if (filterType) {
      filtered = filtered.filter((notification) => notification.type === filterType.value);
    }

    if (filterReadStatus) {
      filtered = filtered.filter((notification) =>
        filterReadStatus.value === 'read' ? notification.read : !notification.read
      );
    }

    setFilteredNotifications(filtered);
  };

  if (loading) {
    return <p>Loading notifications...</p>;
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
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

        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search notifications..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Filters */}
        <div className="flex mb-6 space-x-4">
          <Select
            placeholder="Filter by type"
            options={notificationTypeOptions}
            onChange={handleFilterTypeChange}
            isClearable
          />
          <Select
            placeholder="Filter by read status"
            options={readStatusOptions}
            onChange={handleFilterReadStatusChange}
            isClearable
          />
        </div>

        {/* Notification List */}
        <ul className="space-y-4">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
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
