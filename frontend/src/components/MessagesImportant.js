import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import api from '../utils/api';
import { FaTrash } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MessagesImportant = () => {
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await api.get('/messages/important');
        setMessages(data);
      } catch (error) {
        console.error('Error fetching important messages:', error);
        toast.error('Failed to fetch important messages.');
      }
    };

    fetchMessages();
  }, []);

  const handleDeleteMessage = async (id) => {
    try {
      await api.delete(`/messages/${id}`);
      setMessages((prev) => prev.filter((msg) => msg._id !== id));
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
          onClick={() => navigate(-1)}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg mb-6 hover:bg-gray-600 transition"
        >
          Back
        </button>
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Important Messages</h1>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          {messages.length === 0 ? (
            <p className="text-gray-600">No important messages yet.</p>
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
                <button
                  onClick={() => handleDeleteMessage(message._id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <FaTrash />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesImportant;
