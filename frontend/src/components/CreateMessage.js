import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import api from '../utils/api';
import { FaPaperPlane } from 'react-icons/fa';

const CreateMessage = () => {
  const [recipients, setRecipients] = useState([]);
  const [cc, setCc] = useState([]);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await api.get('/users');
      setUsers(data);
    };

    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const messageData = { recipients, cc, subject, body, attachments };

    try {
      await api.post('/messages', messageData);
      // Handle success (e.g., redirect to inbox or show a success message)
    } catch (error) {
      console.error('Error sending message:', error);
      // Handle error (e.g., show error message)
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Create New Message</h1>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">To:</label>
            <select
              multiple
              value={recipients}
              onChange={(e) => setRecipients([...e.target.selectedOptions].map(option => option.value))}
              className="w-full p-3 border border-gray-300 rounded-lg"
            >
              {users.map((user) => (
                <option key={user._id} value={user._id}>{user.name}</option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">CC:</label>
            <select
              multiple
              value={cc}
              onChange={(e) => setCc([...e.target.selectedOptions].map(option => option.value))}
              className="w-full p-3 border border-gray-300 rounded-lg"
            >
              {users.map((user) => (
                <option key={user._id} value={user._id}>{user.name}</option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Subject:</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Message:</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Attachments:</label>
            <input
              type="file"
              multiple
              onChange={(e) => setAttachments(e.target.files)}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-600 transition"
          >
            <FaPaperPlane className="mr-2" /> Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateMessage;
