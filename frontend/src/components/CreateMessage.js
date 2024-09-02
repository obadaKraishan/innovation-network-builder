import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Sidebar from './Sidebar';
import api from '../utils/api';
import { FaPaperPlane, FaArrowLeft } from 'react-icons/fa'; // Import the back arrow icon
import { ToastContainer, toast } from 'react-toastify';
import Select from 'react-select';
import 'react-toastify/dist/ReactToastify.css';
import SunEditorComponent from './SunEditorComponent';

const CreateMessage = () => {
  const [recipients, setRecipients] = useState([]);
  const [cc, setCc] = useState([]);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await api.get('/users/message-recipients');
        const formattedUsers = data.map(user => ({
          value: user._id,
          label: `${user.name} (${user.email})`,
        }));
        setUsers(formattedUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Failed to fetch users. Please check your permissions.');
      }
    };

    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const messageData = { 
      recipients: recipients.map(recipient => recipient.value), 
      cc: cc.map(c => c.value), 
      subject, 
      body, 
      attachments 
    };

    try {
      await api.post('/messages', messageData);
      toast.success('Message sent successfully!');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message.');
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
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Create New Message</h1>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">To:</label>
            <Select
              isMulti
              value={recipients}
              onChange={setRecipients}
              options={users}
              className="w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">CC:</label>
            <Select
              isMulti
              value={cc}
              onChange={setCc}
              options={users}
              className="w-full"
            />
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
            <SunEditorComponent 
              value={body}
              onChange={setBody}
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
