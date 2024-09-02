import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import api from '../utils/api';
import { FaTrash, FaArrowLeft, FaFilter } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const MessagesSent = () => {
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [isImportant, setIsImportant] = useState(false);
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMessages = async () => {
      const { data } = await api.get('/messages/sent');
      setMessages(data);
      setFilteredMessages(data);
    };

    fetchMessages();
  }, []);

  useEffect(() => {
    filterMessages();
  }, [searchTerm, selectedDate, isImportant, unreadOnly]);

  const filterMessages = () => {
    let filtered = messages;

    if (searchTerm) {
      filtered = filtered.filter(message =>
        message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.body.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.recipients.some(r => r.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedDate) {
      filtered = filtered.filter(message => new Date(message.createdAt).toDateString() === selectedDate.toDateString());
    }

    if (isImportant) {
      filtered = filtered.filter(message => message.isImportant);
    }

    if (unreadOnly) {
      filtered = filtered.filter(message => !message.isRead);
    }

    setFilteredMessages(filtered);
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

  const toggleSelectMessage = (id) => {
    setSelectedMessages(prevSelected =>
      prevSelected.includes(id) ? prevSelected.filter(msgId => msgId !== id) : [...prevSelected, id]
    );
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(selectedMessages.map(id => api.delete(`/messages/${id}`)));
      setMessages(prev => prev.filter(msg => !selectedMessages.includes(msg._id)));
      setSelectedMessages([]);
      toast.success('Selected messages deleted successfully.');
    } catch (error) {
      console.error('Error deleting messages:', error);
      toast.error('Failed to delete selected messages.');
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100">
        <ToastContainer />
        <button
          onClick={() => navigate(-1)}
          className="flex items-center bg-gray-500 text-white px-4 py-2 rounded-lg mb-6 hover:bg-gray-600 transition-all duration-300 ease-in-out shadow-md"
        >
          <FaArrowLeft className="mr-2" /> Back
        </button>
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Sent Messages</h1>
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg w-1/3"
          />
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            placeholderText="Filter by Date"
            className="p-3 border border-gray-300 rounded-lg"
          />
          <div className="flex items-center">
            <label className="mr-2">Important</label>
            <input
              type="checkbox"
              checked={isImportant}
              onChange={() => setIsImportant(prev => !prev)}
              className="mr-4"
            />
            <label className="mr-2">Unread Only</label>
            <input
              type="checkbox"
              checked={unreadOnly}
              onChange={() => setUnreadOnly(prev => !prev)}
            />
          </div>
        </div>
        <button
          onClick={handleBulkDelete}
          disabled={selectedMessages.length === 0}
          className={`bg-red-500 text-white px-4 py-2 rounded-lg mb-6 hover:bg-red-600 transition-all duration-300 ease-in-out shadow-md ${selectedMessages.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Delete Selected
        </button>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          {filteredMessages.length === 0 ? (
            <p className="text-gray-600">No messages found.</p>
          ) : (
            filteredMessages.map((message) => (
              <div key={message._id} className="flex justify-between items-center mb-4 p-3 border-b border-gray-300">
                <div>
                  <input
                    type="checkbox"
                    checked={selectedMessages.includes(message._id)}
                    onChange={() => toggleSelectMessage(message._id)}
                    className="mr-2"
                  />
                  <Link to={`/messages/${message._id}`} className="text-xl font-semibold text-gray-700 hover:underline">
                    {message.subject}
                  </Link>
                  <div
                    className="text-gray-600"
                    dangerouslySetInnerHTML={{ __html: message.body.slice(0, 50) + '...' }}
                  />
                  <p className="text-sm text-gray-500">
                    To: {message.recipients.map(r => r?.name ?? 'Unknown').join(', ')}
                  </p>
                  <p className="text-sm text-gray-500">
                    CC: {message.cc && message.cc.length > 0 ? message.cc.map(c => c?.name ?? 'Unknown').join(', ') : 'None'}
                  </p>
                  <p className="text-sm text-gray-500">
                    Sent: {new Date(message.createdAt).toLocaleString()}
                  </p>
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

export default MessagesSent;
