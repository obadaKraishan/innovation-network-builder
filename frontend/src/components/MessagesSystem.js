import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import { FaInbox, FaPaperPlane, FaStar, FaPlus } from 'react-icons/fa';

const MessagesSystem = () => {
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
      </div>
    </div>
  );
};

export default MessagesSystem;
