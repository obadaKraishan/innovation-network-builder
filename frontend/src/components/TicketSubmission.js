// File: frontend/src/components/TicketSubmission.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Use for back button navigation
import Sidebar from './Sidebar'; // Sidebar component
import { FaPaperclip, FaFileAlt, FaPlusCircle, FaArrowLeft } from 'react-icons/fa'; // Added icons
import { toast } from 'react-toastify';
import api from '../utils/api';

const TicketSubmission = () => {
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [attachments, setAttachments] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // For back navigation

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('description', description);
    formData.append('priority', priority);
    if (attachments) {
      formData.append('attachments', attachments);
    }

    try {
      await api.post('/support', formData);
      toast.success('Ticket submitted successfully');
      setDescription('');
      setPriority('Medium');
      setAttachments(null);
    } catch (error) {
      toast.error('Failed to submit ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar Component */}
      <Sidebar />

      <div className="flex-1 p-6 bg-gray-100 overflow-y-auto">
        {/* Back Button */}
        <button onClick={() => navigate(-1)} className="mb-4 bg-blue-500 text-white py-2 px-4 rounded-lg flex items-center">
          <FaArrowLeft className="mr-2" /> Back
        </button>

        {/* Ticket Submission Form */}
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <FaPlusCircle className="mr-2" /> Submit a New Ticket
          </h2>

          <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
            {/* Issue Description */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                <FaFileAlt className="inline-block mr-1" /> Issue Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Describe the issue..."
                rows="4"
              />
            </div>

            {/* Priority Selector */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            {/* Attachments */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                <FaPaperclip className="inline-block mr-1" /> Attachments
              </label>
              <input
                type="file"
                onChange={(e) => setAttachments(e.target.files[0])}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className={`bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                  loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                }`}
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit Ticket'}
              </button>
            </div>
          </form>
      </div>
    </div>
  );
};

export default TicketSubmission;
