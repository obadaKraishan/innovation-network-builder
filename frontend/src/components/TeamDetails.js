import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify'; // Import Toastify for notifications
import 'react-toastify/dist/ReactToastify.css';
import api from '../utils/api';
import Sidebar from './Sidebar';

const TeamDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [team, setTeam] = useState(null);
  const [newTask, setNewTask] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [deadline, setDeadline] = useState('');
  const [newComment, setNewComment] = useState('');
  const [editCommentId, setEditCommentId] = useState(null);
  const [parentCommentId, setParentCommentId] = useState(null);

  useEffect(() => {
    fetchTeamDetails();
  }, []);

  const fetchTeamDetails = async () => {
    try {
      const response = await api.get(`/teams/${id}`);
      setTeam(response.data);
    } catch (error) {
      console.error('Error fetching team details:', error);
      toast.error('Error fetching team details');
    }
  };

  const addTask = async () => {
    try {
      await api.post(`/teams/${id}/task`, {
        description: newTask,
        assignedTo,
        deadline,
      });
      fetchTeamDetails(); // Refresh the team details after adding a task
      setNewTask('');
      setAssignedTo('');
      setDeadline('');
      toast.success('Task added successfully!');
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error('Error adding task');
    }
  };

  const handleCommentSubmit = async () => {
    try {
      if (editCommentId) {
        await api.put(`/teams/${id}/comment/${editCommentId}`, { comment: newComment });
        toast.success('Comment updated successfully!');
      } else {
        await api.post(`/teams/${id}/comment`, { comment: newComment, parent: parentCommentId });
        toast.success('Comment added successfully!');
      }
      fetchTeamDetails(); // Refresh the team details after adding or editing a comment
      setNewComment('');
      setEditCommentId(null);
      setParentCommentId(null);
    } catch (error) {
      console.error('Error adding/editing comment:', error);
      toast.error('Error adding/editing comment');
    }
  };

  const handleEditComment = (comment) => {
    setNewComment(comment.comment);
    setEditCommentId(comment._id);
    setParentCommentId(comment.parent || null);
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await api.delete(`/teams/${id}/comment/${commentId}`);
      fetchTeamDetails();
      toast.success('Comment deleted successfully!');
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Error deleting comment');
    }
  };

  const renderComments = (comments, parentId = null, level = 0) => {
    return comments
      .filter(comment => comment.parent === parentId)
      .map(comment => (
        <div key={comment._id} style={{ marginLeft: level * 20 }} className="mb-2">
          <div className="flex justify-between items-center">
            <p>
              <strong>{comment.user?.name || "Unknown User"}:</strong> {comment.comment}
            </p>
            <div>
              <FaEdit
                className="inline text-blue-500 cursor-pointer mx-1"
                onClick={() => handleEditComment(comment)}
              />
              <FaTrashAlt
                className="inline text-red-500 cursor-pointer mx-1"
                onClick={() => handleDeleteComment(comment._id)}
              />
            </div>
          </div>
          <button onClick={() => setParentCommentId(comment._id)} className="text-sm text-blue-500">
            Reply
          </button>
          {renderComments(comments, comment._id, level + 1)}
        </div>
      ));
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6">
        <ToastContainer />
        <button onClick={() => navigate('/manage-team')} className="mb-4 text-blue-500 underline">
          Back to Manage Teams
        </button>
        {team ? (
          <>
            <h2 className="text-2xl font-bold mb-6">{team.name} - Team Details</h2>
            <div className="bg-white p-6 rounded shadow-md mb-4">
              <h3 className="text-xl font-semibold mb-4">Team Objective</h3>
              <p>{team.objective}</p>
              <h3 className="text-xl font-semibold mb-4 mt-4">Team Description</h3>
              <p>{team.description}</p>
              <h3 className="text-xl font-semibold mb-4 mt-4">Team Members</h3>
              <p>{team.members?.map(member => member?.name).join(', ') || "No members available"}</p>
            </div>

            <div className="bg-white p-6 rounded shadow-md mb-4">
              <h3 className="text-xl font-semibold mb-4">Tasks</h3>
              <ul>
                {team.tasks?.map(task => (
                  <li key={task._id}>
                    {task.description} - {task.assignedTo?.name || "Unassigned"} - {new Date(task.deadline).toLocaleDateString()}
                  </li>
                )) || "No tasks available"}
              </ul>
              <div className="mt-4">
                <h4 className="text-lg font-semibold mb-2">Add New Task</h4>
                <input
                  type="text"
                  placeholder="Task Description"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded mb-2"
                />
                <select
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded mb-2"
                >
                  <option value="">Assign to</option>
                  {team.members?.map(member => (
                    <option key={member._id} value={member._id}>
                      {member.name}
                    </option>
                  )) || <option disabled>No members available</option>}
                </select>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded mb-4"
                />
                <button onClick={addTask} className="bg-green-500 text-white p-2 rounded w-full">
                  Add Task
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded shadow-md">
              <h3 className="text-xl font-semibold mb-4">Team Discussions</h3>
              <ul>
                {renderComments(team.discussions || [])}
              </ul>
              <div className="mt-4">
                <h4 className="text-lg font-semibold mb-2">{editCommentId ? 'Edit Comment' : 'Add New Comment'}</h4>
                <textarea
                  placeholder="Comment"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded mb-4"
                />
                <button onClick={handleCommentSubmit} className="bg-blue-500 text-white p-2 rounded w-full">
                  {parentCommentId ? 'Reply' : editCommentId ? 'Update Comment' : 'Add Comment'}
                </button>
              </div>
            </div>
          </>
        ) : (
          <p>Loading team details...</p>
        )}
      </div>
    </div>
  );
};

export default TeamDetails;
