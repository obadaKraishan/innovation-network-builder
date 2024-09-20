// File: frontend/src/components/TicketSubmission.js

import React, { useState } from 'react';
import api from '../utils/api';
import { toast } from 'react-toastify';

const TicketSubmission = () => {
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [attachments, setAttachments] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

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
    }
  };

  return (
    <div className="ticket-submission">
      <h2 className="text-xl font-bold mb-4">Submit a New Ticket</h2>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Issue Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
            placeholder="Describe the issue..."
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Attachments</label>
          <input
            type="file"
            onChange={(e) => setAttachments(e.target.files[0])}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none"
          >
            Submit Ticket
          </button>
        </div>
      </form>
    </div>
  );
};

export default TicketSubmission;
