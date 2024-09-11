import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import api from '../utils/api';
import {
  FaBell,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaInfoCircle,
} from 'react-icons/fa';
import Select from 'react-select';
import moment from 'moment';
import ReactPaginate from 'react-paginate'; // For pagination

const NotificationsDashboard = () => {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState(null);
  const [filterReadStatus, setFilterReadStatus] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);

  const notificationsPerPage = 15;

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

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'warning':
        return <FaExclamationTriangle className="text-yellow-500" />;
      case 'success':
        return <FaCheckCircle className="text-green-500" />;
      case 'error':
        return <FaTimesCircle className="text-red-500" />;
      default:
        return <FaInfoCircle className="text-blue-500" />;
    }
  };

  // Pagination
  const pageCount = Math.ceil(filteredNotifications.length / notificationsPerPage);
  const displayNotifications = filteredNotifications.slice(
    currentPage * notificationsPerPage,
    (currentPage + 1) * notificationsPerPage
  );

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
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
          {displayNotifications.length > 0 ? (
            displayNotifications.map((notification) => (
              <li key={notification._id} className={`p-4 rounded-lg shadow-sm border ${notification.read ? 'bg-gray-100 border-gray-300' : 'bg-white border-gray-300'}`}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    {getNotificationIcon(notification.type)}
                    <div className="flex flex-col">
                      <Link to={`/notifications/${notification._id}`} className="text-lg text-gray-800 hover:underline">
                        {notification.message}
                      </Link>
                      <p className="text-sm text-gray-500">Sent by: {notification.sender?.name || 'System'} on {moment(notification.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
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

        {/* Pagination */}
        <div className="mt-6">
          <ReactPaginate
            previousLabel={"Previous"}
            nextLabel={"Next"}
            pageCount={pageCount}
            onPageChange={handlePageClick}
            containerClassName={"paginationBtns"}
            previousLinkClassName={"previousBtn"}
            nextLinkClassName={"nextBtn"}
            disabledClassName={"paginationDisabled"}
            activeClassName={"paginationActive"}
          />
        </div>
      </div>
    </div>
  );
};

export default NotificationsDashboard;
