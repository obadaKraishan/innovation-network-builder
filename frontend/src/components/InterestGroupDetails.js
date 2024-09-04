import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import api from '../utils/api';
import { FaEdit, FaTrashAlt, FaUserPlus, FaSignOutAlt } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const InterestGroupDetails = () => {
  const { id } = useParams();
  const [group, setGroup] = useState(null);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        const { data } = await api.get(`/groups/${id}`);
        setGroup(data);
        setComments(data.comments || []); // Assuming comments are part of the group details
      } catch (error) {
        console.error('Error fetching group details:', error);
      }
    };

    fetchGroupDetails();
  }, [id]);

  const handleAddComment = async () => {
    try {
      const { data } = await api.post(`/groups/${id}/comments`, { comment });
      setComments([...comments, data]);
      setComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleDeleteGroup = async () => {
    try {
      await api.delete(`/groups/${id}`);
      navigate('/interest-groups');
    } catch (error) {
      console.error('Error deleting group:', error);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100 overflow-y-auto">
        {group && (
          <>
            <h2 className="text-3xl font-semibold mb-6">{group.name}</h2>
            <p className="mb-4">{group.description}</p>
            <p className="mb-4">Objectives: {group.objectives}</p>
            <p className="mb-4">Hobbies: {group.hobbies.join(', ')}</p>
            <p className="mb-4">Created by: {group.createdBy.name}</p>

            {group.createdBy._id === JSON.parse(localStorage.getItem('userInfo'))._id && (
              <div className="flex space-x-4 mb-6">
                <button
                  onClick={() => navigate(`/edit-group/${id}`)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-yellow-600 transition"
                >
                  <FaEdit className="mr-2" /> Edit Group
                </button>
                <button
                  onClick={handleDeleteGroup}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-red-600 transition"
                >
                  <FaTrashAlt className="mr-2" /> Delete Group
                </button>
              </div>
            )}

            <h3 className="text-xl font-semibold mb-4">Members</h3>
            <ul className="mb-6">
              {group.members.map(member => (
                <li key={member._id} className="text-gray-700">
                  {member.name} ({member.email})
                </li>
              ))}
            </ul>

            <h3 className="text-xl font-semibold mb-4">Comments</h3>
            <div className="mb-4">
              <ReactQuill value={comment} onChange={setComment} />
              <button
                onClick={handleAddComment}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-2 hover:bg-blue-600 transition"
              >
                Add Comment
              </button>
            </div>

            <div>
              {comments.map((comment, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow-lg mb-4">
                  <p className="text-gray-700">{comment.text}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default InterestGroupDetails;
