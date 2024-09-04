import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import api from '../utils/api';
import { FaEdit, FaTrashAlt, FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const InterestGroupDetails = () => {
  const { id } = useParams();
  const [group, setGroup] = useState(null);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [editCommentId, setEditCommentId] = useState(null);
  const [parentCommentId, setParentCommentId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        const { data } = await api.get(`/groups/${id}`);
        setGroup(data);
        setComments(data.interestGroupDiscussions || []);
      } catch (error) {
        console.error('Error fetching group details:', error);
      }
    };
  
    fetchGroupDetails();
  }, [id]);  

  const handleAddComment = async () => {
    try {
      if (editCommentId) {
        const { data } = await api.put(`/groups/${id}/comments/${editCommentId}`, { comment });
        setComments(comments.map(c => c._id === editCommentId ? data : c));
        toast.success('Comment updated successfully!');
      } else {
        const { data } = await api.post(`/groups/${id}/comments`, { comment, parent: parentCommentId });
        setComments([...comments, data]);
        toast.success('Comment added successfully!');
      }
      setComment('');
      setEditCommentId(null);
      setParentCommentId(null);
    } catch (error) {
      console.error('Error adding/editing comment:', error);
    }
  };

  const handleDeleteGroup = async () => {
    try {
      await api.delete(`/groups/${id}`);
      navigate('/interest-groups');
      toast.success('Group deleted successfully!');
    } catch (error) {
      console.error('Error deleting group:', error);
    }
  };

  const handleEditComment = (comment) => {
    setComment(comment.comment);
    setEditCommentId(comment._id);
    setParentCommentId(comment.parent || null);
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await api.delete(`/groups/${id}/comments/${commentId}`);
      setComments(comments.filter(comment => comment._id !== commentId));
      toast.success('Comment deleted successfully!');
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const renderComments = (comments, parentId = null, level = 0) => {
    return comments
      .filter(comment => comment.parent === parentId)
      .map(comment => (
        <div
          key={comment._id} // Ensure each comment has a unique key
          className={`mb-4 p-4 rounded-lg shadow-sm ${level === 0 ? 'bg-gray-100' : 'mt-4 bg-gray-200 border-l-4 border-blue-300'}`}
          style={{ marginLeft: level * 20 }}
        >
          <div className="flex justify-between items-center mb-2">
            <p className="font-semibold text-gray-700">
              {comment.user?.name || "Unknown User"}:
            </p>
            <div className="text-xs text-gray-500">
              {new Date(comment.createdAt).toLocaleDateString()}
            </div>
          </div>
          <p className="text-gray-800 mb-2">{comment.comment}</p>
          <div className="flex justify-between items-center">
            <button
              onClick={() => setParentCommentId(comment._id)}
              className="text-xs text-blue-500 hover:underline"
            >
              Reply
            </button>
            <div className="flex space-x-2">
              <FaEdit className="text-blue-500 cursor-pointer" onClick={() => handleEditComment(comment)} />
              <FaTrashAlt className="text-red-500 cursor-pointer" onClick={() => handleDeleteComment(comment._id)} />
            </div>
          </div>
          {renderComments(comments, comment._id, level + 1)}
        </div>
      ));
  };  

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 bg-gray-100 overflow-y-auto p-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 bg-blue-500 text-white py-2 px-4 rounded inline-flex items-center hover:bg-blue-600 transition"
        >
          <FaArrowLeft className="mr-2" />
          Back
        </button>
        {group && (
          <>
            <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
              <h2 className="text-3xl font-bold mb-4">{group.name}</h2>
              <p className="text-gray-700 mb-4">{group.description}</p>
              <p className="text-gray-600 mb-4"><strong>Objectives:</strong> {group.objectives}</p>
              <p className="text-gray-600 mb-4"><strong>Hobbies:</strong> {group.hobbies.join(', ')}</p>
              <p className="text-gray-600 mb-4"><strong>Created by:</strong> {group.createdBy.name}</p>

              {group.createdBy._id === JSON.parse(localStorage.getItem('userInfo'))._id && (
                <div className="flex space-x-4 mb-6">
                  <button
                    onClick={() => navigate(`/edit-group/${id}`)}
                    className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 transition"
                  >
                    <FaEdit className="mr-2" /> Edit Group
                  </button>
                  <button
                    onClick={handleDeleteGroup}
                    className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
                  >
                    <FaTrashAlt className="mr-2" /> Delete Group
                  </button>
                </div>
              )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
              <h3 className="text-2xl font-semibold mb-4">Members</h3>
              <ul className="space-y-2">
                {group.members.map(member => (
                  <li key={member._id} className="text-gray-700">{member.name} ({member.email})</li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold mb-4">Comments</h3>

              <div className="mt-6">
                {renderComments(comments)}
              </div>

              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add your comment..."
                className="w-full p-3 border border-gray-300 rounded mb-4"
              />
              <button
                onClick={handleAddComment}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
              >
                {parentCommentId ? 'Reply' : editCommentId ? 'Update Comment' : 'Add Comment'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default InterestGroupDetails;
