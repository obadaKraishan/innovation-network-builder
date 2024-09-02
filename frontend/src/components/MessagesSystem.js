import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import api from '../utils/api';
import { FaInbox, FaPaperPlane, FaStar, FaPlus, FaChevronRight } from 'react-icons/fa';

const MessagesSystem = () => {
  const [latestInbox, setLatestInbox] = useState(null);
  const [latestSent, setLatestSent] = useState(null);
  const [latestImportant, setLatestImportant] = useState(null);

  useEffect(() => {
    const fetchLatestMessages = async () => {
      const inboxData = await api.get('/messages/inbox');
      const sentData = await api.get('/messages/sent');
      const importantData = await api.get('/messages/important');
      if (inboxData.data.length > 0) setLatestInbox(inboxData.data[0]);
      if (sentData.data.length > 0) setLatestSent(sentData.data[0]);
      if (importantData.data.length > 0) setLatestImportant(importantData.data[0]);
    };

    fetchLatestMessages();
  }, []);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-50">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Messages System</h1>
        <div className="space-y-6">
          <Link to="/messages/inbox" className="block bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <FaInbox className="text-2xl text-blue-500" />
                <span className="text-xl font-semibold text-gray-800">Inbox</span>
              </div>
              <FaChevronRight className="text-xl text-gray-400" />
            </div>
            {latestInbox ? (
              <div className="mt-4 text-gray-600">
                <p className="font-medium">Subject: {latestInbox.subject}</p>
                <p>From: {latestInbox.sender.name}</p>
                <p className="text-sm text-gray-500">{new Date(latestInbox.createdAt).toLocaleString()}</p>
              </div>
            ) : (
              <p className="mt-4 text-gray-500">No messages in Inbox</p>
            )}
          </Link>

          <Link to="/messages/sent" className="block bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <FaPaperPlane className="text-2xl text-green-500" />
                <span className="text-xl font-semibold text-gray-800">Sent</span>
              </div>
              <FaChevronRight className="text-xl text-gray-400" />
            </div>
            {latestSent ? (
              <div className="mt-4 text-gray-600">
                <p className="font-medium">Subject: {latestSent.subject}</p>
                <p>To: {latestSent.recipients.map(r => r.name).join(', ')}</p>
                <p className="text-sm text-gray-500">{new Date(latestSent.createdAt).toLocaleString()}</p>
              </div>
            ) : (
              <p className="mt-4 text-gray-500">No sent messages</p>
            )}
          </Link>

          <Link to="/messages/important" className="block bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <FaStar className="text-2xl text-yellow-500" />
                <span className="text-xl font-semibold text-gray-800">Important</span>
              </div>
              <FaChevronRight className="text-xl text-gray-400" />
            </div>
            {latestImportant ? (
              <div className="mt-4 text-gray-600">
                <p className="font-medium">Subject: {latestImportant.subject}</p>
                <p>From: {latestImportant.sender.name}</p>
                <p className="text-sm text-gray-500">{new Date(latestImportant.createdAt).toLocaleString()}</p>
              </div>
            ) : (
              <p className="mt-4 text-gray-500">No important messages</p>
            )}
          </Link>

          <Link to="/messages/create" className="block bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <FaPlus className="text-2xl text-red-500" />
                <span className="text-xl font-semibold text-gray-800">Create Message</span>
              </div>
              <FaChevronRight className="text-xl text-gray-400" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MessagesSystem;
