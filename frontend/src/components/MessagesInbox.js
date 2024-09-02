import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import api from '../utils/api';
import { FaStar, FaTrash, FaArrowLeft } from 'react-icons/fa'; // Import the back arrow icon
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MessagesInbox = () => {
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMessages = async () => {
      const { data } = await api.get('/messages/inbox');
      setMessages(data);
    };

    fetchMessages();
  }, []);

  const handleMarkImportant = async (id) => {
    try {
      await api.put(`/messages/${id}/important`);
      setMessages((prev) => prev.map(msg => msg._id === id ? { ...msg, isImportant: !msg.isImportant } : msg));
      toast.success('Message marked as important!');
    } catch (error) {
      console.error('Error marking message as important:', error);
      toast.error('Failed to mark message as important.');
    }
  };

  const handleDeleteMessage = async (id) => {
    try {
      await api.delete(`/messages/${id}`);
      setMessages((prev) => prev.filter(msg => msg._id !== id));
      toast.success('Message deleted successfully.');
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error('Failed to delete message.');
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100">
        <ToastContainer />
        <button
          onClick={() => navigate(-1)} // Navigate to the previous page
          className="flex items-center bg-gray-500 text-white px-4 py-2 rounded-lg mb-6 hover:bg-gray-600 transition"
        >
          <FaArrowLeft className="mr-2" /> Back
        </button>
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Inbox</h1>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          {messages.length === 0 ? (
            <p className="text-gray-600">No messages yet.</p>
          ) : (
            messages.map((message) => (
              <div key={message._id} className="flex justify-between items-center mb-4 p-3 border-b border-gray-300">
                <div>
                  <Link to={`/messages/${message._id}`} className="text-xl font-semibold text-gray-700 hover:underline">
                    {message.subject}
                  </Link>
                  <p className="text-gray-600">{message.body.slice(0, 50)}...</p>
                  <p className="text-sm text-gray-500">From: {message.sender.name}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleMarkImportant(message._id)}
                    className={`text-yellow-500 ${message.isImportant ? 'text-yellow-600' : ''}`}
                  >
                    <FaStar />
                  </button>
                  <button
                    onClick={() => handleDeleteMessage(message._id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesInbox;
