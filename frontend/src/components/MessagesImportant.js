import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import api from '../utils/api';
import { Link } from 'react-router-dom';
import { FaTrash, FaEnvelopeOpen } from 'react-icons/fa';

const MessagesImportant = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      const { data } = await api.get('/messages/important');
      setMessages(data);
    };

    fetchMessages();
  }, []);

  const handleDeleteMessage = async (id) => {
    try {
      await api.delete(`/messages/${id}`);
      setMessages((prev) => prev.filter(msg => msg._id !== id));
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Important Messages</h1>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          {messages.map((message) => (
            <div key={message._id} className="flex justify-between items-center mb-4 p-3 border-b border-gray-300">
              <div>
                <Link to={`/messages/${message._id}`} className="text-xl font-semibold text-gray-700 hover:underline">
                  {message.subject}
                </Link>
                <p className="text-gray-600">{message.body.slice(0, 50)}...</p>
                <p className="text-sm text-gray-500">From: {message.sender.name}</p>
              </div>
              <button
                onClick={() => handleDeleteMessage(message._id)}
                className="text-red-500 hover:text-red-600"
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MessagesImportant;
