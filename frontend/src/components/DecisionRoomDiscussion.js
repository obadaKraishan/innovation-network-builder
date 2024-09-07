import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaEdit, FaTrashAlt, FaReply } from 'react-icons/fa';
import Sidebar from './Sidebar';
import api from '../utils/api';
import { toast } from 'react-toastify';
import AuthContext from '../context/AuthContext';
import { formatDistanceToNow, parseISO } from 'date-fns';

const DecisionRoomDiscussion = () => {
  const { id, proposalId } = useParams();
  const [discussion, setDiscussion] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [editMessageId, setEditMessageId] = useState(null);
  const [parentMessageId, setParentMessageId] = useState(null); // For replies
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDiscussion = async () => {
      try {
        const { data } = await api.get(`/decisions/${id}/proposal/${proposalId}/discussion`);
        console.log("Fetched discussion:", data);
        setDiscussion(data);  // Make sure this sets the fetched data into state
        setLoading(false);
      } catch (error) {
        toast.error('Failed to load discussion');
        setLoading(false);
      }
    };
    fetchDiscussion();
  }, [id, proposalId]);  
  
  const handleAddMessage = async () => {
    try {
      const endpoint = editMessageId
        ? `/decisions/${id}/proposal/${proposalId}/discussion/${editMessageId}`
        : `/decisions/${id}/proposal/${proposalId}/discussion`;
  
      const { data } = await api.post(endpoint, {
        messageText: newMessage,
        parent: parentMessageId, // Add parent if it is a reply
      });
  
      setNewMessage('');
      setEditMessageId(null);
      setParentMessageId(null);
      toast.success('Message added/updated successfully');
      
      // Directly set the updated discussion from the POST response
      setDiscussion(data);
    } catch (error) {
      toast.error('Failed to add message');
    }
  };
  

  const handleEditMessage = (message) => {
    setNewMessage(message.messageText);
    setEditMessageId(message._id);
    setParentMessageId(message.parent || null);
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await api.delete(`/decisions/${id}/proposal/${proposalId}/discussion/${messageId}`);
      toast.success('Message deleted successfully');
      const { data } = await api.get(`/decisions/${id}/proposal/${proposalId}/discussion`);
      setDiscussion(data);
    } catch (error) {
      toast.error('Failed to delete message');
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = parseISO(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  const renderDiscussion = (messages, parentId = null, level = 0) => {
    return messages
      .filter(message => message.parent === parentId)  // Ensure parent-child relation is correct
      .map(message => (
        <div
          key={message._id}
          className={`p-4 mb-4 rounded-lg ${level === 0 ? 'bg-gray-100' : 'bg-gray-200'}`}
          style={{ marginLeft: level * 20 }}
        >
          <div className="flex justify-between items-center mb-2">
          <p className="font-semibold text-gray-700">
                {message.postedBy?.name || 'Unknown'}:
            </p>
            <p className="text-sm text-gray-500">{formatTimeAgo(message.createdAt)}</p>
          </div>
          <p className="text-gray-800">{message.messageText}</p>
          <div className="flex justify-between items-center mt-2">
            <button
              onClick={() => setParentMessageId(message._id)}
              className="text-xs text-blue-500 hover:underline"
            >
              <FaReply className="inline mr-1" /> Reply
            </button>
            <div className="flex">
              {message.postedBy === user?._id && (  // Assuming `user._id` is accessible
                <>
                  <FaEdit
                    className="text-blue-500 cursor-pointer mr-3"
                    onClick={() => handleEditMessage(message)}
                  />
                  <FaTrashAlt
                    className="text-red-500 cursor-pointer"
                    onClick={() => handleDeleteMessage(message._id)}
                  />
                </>
              )}
            </div>
          </div>
          {renderDiscussion(messages, message._id, level + 1)} {/* Recursive call for nested comments */}
        </div>
      ));
  };   

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 overflow-y-auto p-6 bg-gray-100">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 bg-blue-500 text-white py-2 px-4 rounded inline-flex items-center hover:bg-blue-600 transition"
        >
          <FaArrowLeft className="mr-2" /> Back
        </button>
        <h1 className="text-2xl font-bold mb-6">Proposal Discussion</h1>
        <div className="bg-white p-6 shadow rounded-lg mb-6">
          {discussion.length > 0 ? (
            <ul>{renderDiscussion(discussion)}</ul>
          ) : (
            <p className="text-gray-500">No messages yet. Be the first to contribute to the discussion.</p>
          )}
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
            {editMessageId ? 'Update Message' : parentMessageId ? 'Reply' : 'Add Message'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default DecisionRoomDiscussion;
