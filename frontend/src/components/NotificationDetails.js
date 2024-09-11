import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { FaArrowLeft } from 'react-icons/fa';

const NotificationDetails = () => {
  const { id } = useParams();
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  if (loading) {
    return <p>Loading notification details...</p>;
  }

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
      >
        <FaArrowLeft className="mr-2" /> Back
      </button>
      {notification ? (
        <>
          <h2 className="text-2xl font-semibold text-gray-800">{notification.message}</h2>
          <p className="text-gray-600 mt-4">{notification.link ? `Link: ${notification.link}` : 'No additional link provided.'}</p>
          <p className="text-gray-600 mt-4">Type: {notification.type}</p>
        </>
      ) : (
        <p>No details available for this notification.</p>
      )}
    </div>
  );
};

export default NotificationDetails;
