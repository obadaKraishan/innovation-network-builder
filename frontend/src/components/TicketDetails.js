import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaCheck, FaUserPlus, FaSpinner } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom'; // To handle navigation and ticketId
import api from '../utils/api';
import { toast } from 'react-toastify';
import Sidebar from './Sidebar';

const TicketDetails = () => {
  const { ticketId } = useParams(); // Get ticketId from route params
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null); // Store ticket data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [status, setStatus] = useState(''); // Ticket status state
  const [assignedTo, setAssignedTo] = useState(''); // User assigned to ticket
  const [technicalSupportUsers, setTechnicalSupportUsers] = useState([]); // Store technical support specialists
  const [feedback, setFeedback] = useState(''); // Feedback input
  const [feedbackList, setFeedbackList] = useState([]); // Store feedback history

  // Fetch ticket details and available technical support specialists
  useEffect(() => {
    const fetchTicketDetails = async () => {
      try {
        const { data } = await api.get(`/support/${ticketId}`);
        setTicket(data);
        setStatus(data.status);
        setAssignedTo(data.assignedTo?._id || '');
        setFeedbackList(data.feedback || []); // Initialize feedback list
        setLoading(false);
      } catch (err) {
        setError('Failed to load ticket details');
        setLoading(false);
      }
    };

    const fetchTechnicalSupportUsers = async () => {
      try {
        const { data } = await api.get('/users?position=Technical Support Specialist');
        setTechnicalSupportUsers(data);
      } catch (err) {
        toast.error('Failed to load technical support specialists');
      }
    };

    fetchTicketDetails();
    fetchTechnicalSupportUsers();
  }, [ticketId]);

  // Update ticket status
  const updateStatus = async (newStatus) => {
    try {
      await api.put(`/support/${ticketId}/status`, { status: newStatus });
      setStatus(newStatus);
      toast.success(`Ticket status updated to ${newStatus}`);
    } catch (err) {
      toast.error('Failed to update ticket status');
    }
  };

  // Assign user to ticket
  const assignUser = async (userId) => {
    try {
      await api.put(`/support/${ticketId}/assign`, { userId });
      setAssignedTo(userId);
      toast.success('Assigned user to ticket');
    } catch (err) {
      toast.error('Failed to assign user to ticket');
    }
  };

  // Add feedback to the ticket
  const addFeedback = async () => {
    if (!feedback) {
      toast.error('Please provide feedback before submitting.');
      return;
    }

    try {
      await api.post(`/support/${ticketId}/feedback`, { comment: feedback });
      setFeedbackList([...feedbackList, { comment: feedback, date: new Date() }]); // Update feedback list
      setFeedback('');
      toast.success('Feedback added successfully');
    } catch (err) {
      toast.error('Failed to add feedback');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="animate-spin text-4xl text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 mt-10">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex-1 p-6 bg-gray-100 overflow-auto">
        <button
          className="mb-6 flex items-center bg-gray-200 p-3 rounded hover:bg-gray-300"
          onClick={() => navigate('/support-management')}
        >
          <FaArrowLeft className="mr-2" /> Back to Ticket Management
        </button>

        <div className="bg-white shadow-md rounded p-6">
          <h2 className="text-2xl font-bold mb-4">Ticket ID: {ticket.ticketId}</h2>

          <p className="mb-4"><strong>Description:</strong> {ticket.description}</p>
          <p className="mb-4"><strong>Sub-Department:</strong> {ticket.department?.name || 'N/A'}</p>
          <p className="mb-4"><strong>Parent Department:</strong> {ticket.department?.parentDepartment?.name || 'N/A'}</p>
          <p className="mb-4"><strong>Priority:</strong> {ticket.priority}</p>
          <p className="mb-4"><strong>Status:</strong> {ticket.status}</p>
          <p className="mb-4"><strong>Assigned To:</strong> {ticket.assignedTo ? ticket.assignedTo.name : 'Unassigned'}</p>
          <p className="mb-4"><strong>Created At:</strong> {new Date(ticket.createdAt).toLocaleString()}</p>

          {/* Status Update Section */}
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-2">Update Status</h3>
            <div className="flex space-x-4">
              <button
                className={`bg-yellow-500 text-white px-4 py-2 rounded ${status === 'In Progress' ? 'opacity-50' : 'hover:bg-yellow-600'}`}
                onClick={() => updateStatus('In Progress')}
                disabled={status === 'In Progress'}
              >
                In Progress
              </button>
              <button
                className={`bg-green-500 text-white px-4 py-2 rounded ${status === 'Closed' ? 'opacity-50' : 'hover:bg-green-600'}`}
                onClick={() => updateStatus('Closed')}
                disabled={status === 'Closed'}
              >
                Closed
              </button>
            </div>
          </div>

          {/* Assign Technical Support Specialist */}
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-2">Assign Technical Support Specialist</h3>
            <select
              className="w-full p-3 border border-gray-300 rounded"
              value={assignedTo}
              onChange={(e) => assignUser(e.target.value)}
            >
              <option value="">Unassigned</option>
              {technicalSupportUsers
                .filter(user => user?.position === 'Technical Support Specialist')
                .map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name}
                  </option>
              ))}
            </select>
          </div>

          {/* Feedback Section */}
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-2">Feedback</h3>
            <ul className="list-disc ml-6 mb-4">
              {feedbackList.map((fb, index) => (
                <li key={index}>
                  <p><strong>Date:</strong> {new Date(fb.date).toLocaleString()}</p>
                  <p><strong>Comment:</strong> {fb.comment}</p>
                </li>
              ))}
            </ul>

            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Enter feedback here..."
              className="w-full p-3 border border-gray-300 rounded mb-4"
            ></textarea>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={addFeedback}
            >
              Add Feedback
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;
