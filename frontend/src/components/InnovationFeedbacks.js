import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrashAlt, FaReply } from 'react-icons/fa';
import api from '../utils/api';
import { toast } from 'react-toastify';

const InnovationFeedbacks = ({ ideaId }) => {
  const [feedback, setFeedback] = useState([]);
  const [newFeedback, setNewFeedback] = useState('');
  const [parentFeedbackId, setParentFeedbackId] = useState(null);
  const [editFeedbackId, setEditFeedbackId] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const { data } = await api.get(`/innovation/feedback/${ideaId}`);
      setFeedback(data);
      setLoading(false); // Stop loading once feedback is fetched
    } catch (error) {
      toast.error('Failed to load feedback');
      setLoading(false);
    }
  };

  const handleAddFeedback = async () => {
    try {
      if (editFeedbackId) {
        await api.put(`/innovation/feedback/${editFeedbackId}`, { comment: newFeedback });
        toast.success('Feedback updated');
      } else {
        await api.post(`/innovation/feedback`, { comment: newFeedback, parent: parentFeedbackId, ideaId });
        toast.success('Feedback added');
      }
      setNewFeedback('');
      setEditFeedbackId(null);
      setParentFeedbackId(null);
      fetchFeedback();
    } catch (error) {
      toast.error('Failed to submit feedback');
    }
  };

  const handleEditFeedback = (feedback) => {
    setNewFeedback(feedback.comment);
    setEditFeedbackId(feedback._id);
    setParentFeedbackId(feedback.parent || null);
  };

  const handleDeleteFeedback = async (feedbackId) => {
    try {
      await api.delete(`/innovation/feedback/${feedbackId}`);
      toast.success('Feedback deleted');
      fetchFeedback();
    } catch (error) {
      toast.error('Failed to delete feedback');
    }
  };

  const renderFeedback = (feedbackList, parentId = null) => {
    return feedbackList
      .filter((item) => item.parent === parentId)
      .map((item) => (
        <div key={item._id} className="mb-4">
          <div className="p-4 bg-gray-200 rounded-lg mb-2">
            <p className="font-semibold">{item.user.name}</p>
            <p>{item.comment}</p>
            <div className="flex space-x-2 mt-2">
              <button onClick={() => setParentFeedbackId(item._id)} className="text-blue-500">
                <FaReply /> Reply
              </button>
              <button onClick={() => handleEditFeedback(item)} className="text-yellow-500">
                <FaEdit /> Edit
              </button>
              <button onClick={() => handleDeleteFeedback(item._id)} className="text-red-500">
                <FaTrashAlt /> Delete
              </button>
            </div>
          </div>
          <div className="ml-6">{renderFeedback(feedbackList, item._id)}</div>
        </div>
      ));
  };

  return (
    <div>
      {/* Textarea for adding feedback */}
      <textarea
        value={newFeedback}
        onChange={(e) => setNewFeedback(e.target.value)}
        className="w-full p-3 border rounded-lg mb-4"
        rows="4"
        placeholder="Add feedback"
      />
      <button
        onClick={handleAddFeedback}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
      >
        {editFeedbackId ? 'Update Feedback' : 'Add Feedback'}
      </button>

      {/* Placeholder for no feedback */}
      {loading ? (
        <div>Loading feedback...</div>
      ) : feedback.length === 0 ? (
        <div className="mt-6 text-gray-500">No feedback yet. Be the first to provide feedback!</div>
      ) : (
        <div className="mt-6">{renderFeedback(feedback)}</div>
      )}
    </div>
  );
};

export default InnovationFeedbacks;
