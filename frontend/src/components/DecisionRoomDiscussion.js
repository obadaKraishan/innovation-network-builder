import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import api from '../utils/api';
import { toast } from 'react-toastify';
import { FaArrowLeft } from 'react-icons/fa';

const DecisionRoomDiscussion = () => {
  const { id, proposalId } = useParams();
  const [discussion, setDiscussion] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDiscussion = async () => {
      try {
        const { data } = await api.get(`/decisions/${id}/proposal/${proposalId}/discussion`);
        setDiscussion(data);
        setLoading(false);
      } catch (error) {
        toast.error('Failed to load discussion');
      }
    };

    fetchDiscussion();
  }, [id, proposalId]);

  const handleAddMessage = async () => {
    try {
      await api.post(`/decisions/${id}/proposal/${proposalId}/discussion`, {
        messageText: newMessage,
      });
      setNewMessage('');
      toast.success('Message added successfully');
    } catch (error) {
      toast.error('Failed to add message');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 bg-blue-500 text-white py-2 px-4 rounded inline-flex items-center hover:bg-blue-600 transition"
        >
          <FaArrowLeft className="mr-2" /> Back
        </button>
        <h1 className="text-2xl font-bold mb-6">Proposal Discussion</h1>
        <div className="bg-white p-6 shadow rounded-lg mb-6">
          <ul>
            {discussion.map((msg) => (
              <li key={msg._id} className="border-b mb-4 pb-4">
                <strong>{msg.postedBy.name}:</strong> {msg.messageText}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white p-6 shadow rounded-lg">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="w-full p-3 border rounded-lg"
            placeholder="Add a message..."
          />
          <button
            onClick={handleAddMessage}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Add Message
          </button>
        </div>
      </div>
    </div>
  );
};

export default DecisionRoomDiscussion;
