import Swal from 'sweetalert2';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import api from '../utils/api';
import { FaEdit, FaTrashAlt, FaArrowLeft, FaSignOutAlt, FaUserPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const InterestGroupDetails = () => {
  const { id } = useParams(); // Grabs the group ID from the URL params
  const [group, setGroup] = useState(null); // State to hold group details
  const [comment, setComment] = useState(''); // State to handle comment input
  const [comments, setComments] = useState([]); // State to manage all comments
  const [editCommentId, setEditCommentId] = useState(null); // State to manage editing comments
  const [parentCommentId, setParentCommentId] = useState(null); // State to manage reply threading
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('userInfo')); // Retrieves user info from localStorage

  // Fetch group details on component mount or when `id` changes
  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        const { data } = await api.get(`/groups/${id}`);
        setGroup(data);
        setComments(data.interestGroupDiscussions || []);
      } catch (error) {
        console.error('Error fetching group details:', error);
        toast.error('Failed to load group details.');
      }
    };
  
    fetchGroupDetails();
  }, [id]);

  // Add or update a comment
  const handleAddComment = async () => {
    try {
      if (editCommentId) {
        const { data } = await api.put(`/groups/${id}/comments/${editCommentId}`, { comment });
        setComments(comments.map(c => c._id === editCommentId ? data : c));
        toast.success('Comment updated successfully!');
      } else {
        const { data } = await api.post(`/groups/${id}/comments`, { comment, parent: parentCommentId });
        setComments([...comments, data]);
        toast.success(parentCommentId ? 'Reply added successfully!' : 'Comment added successfully!');
      }
      setComment(''); // Clear the comment input
      setEditCommentId(null); // Reset editing state
      setParentCommentId(null); // Reset parent comment ID
    } catch (error) {
      console.error('Error adding/editing comment:', error);
      toast.error('Failed to add/update comment.');
    }
  };

  // Delete the group (only available to the group's creator)
  const handleDeleteGroup = async () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/groups/${id}`);
          toast.success('Group deleted successfully!');
          navigate('/interest-groups'); // Redirect to the interest groups list
        } catch (error) {
          console.error('Error deleting group:', error);
          toast.error('Error deleting group.');
        }
      }
    });
  };

  // Leave the group (available to all members except the creator)
  const handleLeaveGroup = async () => {
    try {
      await api.put(`/groups/${id}/leave`);
      toast.success('You have left the group.');
      navigate('/interest-groups');
    } catch (error) {
      console.error('Error leaving group:', error);
      toast.error('Failed to leave the group.');
    }
  };

  // Request to join the group
  const handleRequestToJoin = async () => {
    try {
      await api.post(`/groups/${id}/invite`, { userId: user._id });
      toast.success('Join request sent successfully!');
    } catch (error) {
      console.error('Error requesting to join group:', error);
      toast.error('Failed to send join request.');
    }
  };

  // Edit a comment (loads the comment into the input for editing)
  const handleEditComment = (comment) => {
    setComment(comment.comment);
    setEditCommentId(comment._id);
    setParentCommentId(comment.parent || null);
  };

  // Delete a comment
  const handleDeleteComment = async (commentId) => {
    try {
      await api.delete(`/groups/${id}/comments/${commentId}`);
      setComments(comments.filter(comment => comment._id !== commentId));
      toast.success('Comment deleted successfully!');
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Error deleting comment.');
    }
  };

  // Render comments recursively with a limit on nesting levels
  const renderComments = (comments, parentId = null, level = 0) => {
    if (level > 5) {  // Prevents infinite recursion by limiting nesting levels
      return null;
    }
  
    const filteredComments = comments.filter(comment => comment.parent === parentId);
  
    return filteredComments.map(comment => (
      <div
        key={comment._id}
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
            {comment.user?._id === user._id && (
              <>
                <FaEdit className="text-blue-500 cursor-pointer" onClick={() => handleEditComment(comment)} />
                <FaTrashAlt className="text-red-500 cursor-pointer" onClick={() => handleDeleteComment(comment._id)} />
              </>
            )}
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

              {group.createdBy._id === user._id ? (
                <div className="flex space-x-4 mb-6">
                  <button
                    onClick={() => navigate(`/edit-interest-group/${id}`)}
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
                  <button
                    onClick={() => navigate(`/invite-to-group/${id}`)}
                    className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition"
                  >
                    <FaUserPlus className="mr-2" /> Send Invitations
                  </button>
                </div>
              ) : group.members.some(member => member._id === user._id) ? (
                <button
                  onClick={handleLeaveGroup}
                  className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition mb-6"
                >
                  <FaSignOutAlt className="mr-2" /> Leave Group
                </button>
              ) : (
                <button
                  onClick={handleRequestToJoin}
                  className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition mb-6"
                >
                  <FaUserPlus className="mr-2" /> Request to Join
                </button>
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

            {group.members.some(member => member._id === user._id) || group.createdBy._id === user._id ? (
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
            ) : (
              <p className="text-gray-500">Only members can view and participate in the discussion.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default InterestGroupDetails;
