import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import api from '../utils/api';
import { FaInbox, FaPaperPlane, FaStar, FaPlus } from 'react-icons/fa';

const MessagesSystem = () => {
  const [latestInbox, setLatestInbox] = useState(null);
  const [latestSent, setLatestSent] = useState(null);

  useEffect(() => {
    const fetchLatestMessages = async () => {
      const inboxData = await api.get('/messages/inbox');
      const sentData = await api.get('/messages/sent');
      if (inboxData.data.length > 0) setLatestInbox(inboxData.data[0]);
      if (sentData.data.length > 0) setLatestSent(sentData.data[0]);
    };

    fetchLatestMessages();
  }, []);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Messages System</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link to="/messages/inbox" className="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-4 hover:bg-blue-500 hover:text-white transition">
            <FaInbox className="text-2xl" />
            <span className="text-xl font-semibold">Inbox</span>
          </Link>
          <Link to="/messages/sent" className="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-4 hover:bg-green-500 hover:text-white transition">
            <FaPaperPlane className="text-2xl" />
            <span className="text-xl font-semibold">Sent</span>
          </Link>
          <Link to="/messages/important" className="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-4 hover:bg-yellow-500 hover:text-white transition">
            <FaStar className="text-2xl" />
            <span className="text-xl font-semibold">Important</span>
          </Link>
          <Link to="/messages/create" className="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-4 hover:bg-red-500 hover:text-white transition">
            <FaPlus className="text-2xl" />
            <span className="text-xl font-semibold">Create Message</span>
          </Link>
        </div>
        <div className="mt-6">
          {latestInbox && (
            <div className="bg-blue-100 p-4 rounded-lg mb-4">
              <h2 className="text-xl font-semibold text-gray-700">Latest Inbox Message</h2>
              <p className="text-sm text-gray-500">Subject: {latestInbox.subject}</p>
              <p className="text-sm text-gray-500">From: {latestInbox.sender.name}</p>
            </div>
          )}
          {latestSent && (
            <div className="bg-green-100 p-4 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-700">Latest Sent Message</h2>
              <p className="text-sm text-gray-500">Subject: {latestSent.subject}</p>
              <p className="text-sm text-gray-500">To: {latestSent.recipients.map(r => r.name).join(', ')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesSystem;
