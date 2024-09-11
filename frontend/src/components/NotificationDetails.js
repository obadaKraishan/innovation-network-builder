import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar'; // Sidebar component import
import api from '../utils/api';
import { FaArrowLeft, FaInfoCircle, FaCheckCircle, FaExclamationTriangle, FaTimesCircle } from 'react-icons/fa';
import moment from 'moment';

const NotificationDetails = () => {
  const { id } = useParams();
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // For back button navigation

  useEffect(() => {
    const fetchNotificationDetails = async () => {
      try {
        const { data } = await api.get(`/notifications/${id}`);
        setNotification(data);

        // Mark as read when opened
        if (!data.read) {
          await api.put(`/notifications/${id}/read`);
        }
      } catch (error) {
        console.error('Error fetching notification details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotificationDetails();
  }, [id]);

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

  if (loading) {
    return <p>Loading notification details...</p>;
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 overflow-y-auto p-6 bg-gray-100">
        <div className="mb-4 flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            <FaArrowLeft className="mr-2" />
            Back
          </button>
        </div>

        {notification ? (
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex items-center mb-4">
              {getNotificationIcon(notification.type)}
              <h2 className="text-2xl font-semibold text-gray-800 ml-3">{notification.message}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600"><strong>Sender:</strong> {notification.sender?.name || 'System'}</p>
                <p className="text-gray-600"><strong>Recipient:</strong> You</p>
                <p className="text-gray-600"><strong>Type:</strong> {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}</p>
              </div>

              <div>
                <p className="text-gray-600"><strong>Created At:</strong> {moment(notification.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</p>
                {notification.link && (
                  <p className="text-gray-600">
                    <strong>Link:</strong> <a href={notification.link} className="text-blue-500 hover:underline">{notification.link}</a>
                  </p>
                )}
              </div>
            </div>

            <p className={`mt-6 text-sm ${notification.read ? 'text-green-600' : 'text-yellow-500'}`}>
              {notification.read ? 'This notification has been read.' : 'This notification is unread.'}
            </p>
          </div>
        ) : (
          <p>No details available for this notification.</p>
        )}
      </div>
    </div>
  );
};

export default NotificationDetails;
