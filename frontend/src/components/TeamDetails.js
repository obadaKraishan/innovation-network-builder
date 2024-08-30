import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../utils/api';
import Sidebar from './Sidebar';
import AuthContext from '../context/AuthContext';
import { formatDistanceToNow, parseISO } from 'date-fns';

const TeamDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
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
      fetchTeamDetails();
      setNewTask('');
      setAssignedTo('');
      setDeadline('');
      toast.success('Task added successfully!');
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error('Error adding task');
    }
  };

  const updateTaskStatus = async (taskId, status) => {
    try {
      await api.put(`/teams/${id}/task/${taskId}`, { status });
      fetchTeamDetails();
      toast.success('Task status updated successfully!');
    } catch (error) {
      console.error('Error updating task status:', error);
      toast.error('Error updating task status');
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
      fetchTeamDetails();
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

  const formatTimeAgo = (dateString) => {
    const date = parseISO(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
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
            <div className="text-sm text-gray-500">
              {formatTimeAgo(comment.createdAt)}
            </div>
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

            {user.role === 'Employee' && (
              <div className="bg-white p-6 rounded shadow-md mb-4">
                <h3 className="text-xl font-semibold mb-4">My Tasks</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {team.tasks?.filter(task => task.assignedTo?._id === user._id).map(task => (
                    <div key={task._id} className="bg-gray-100 p-4 rounded shadow-md">
                      <h4 className="text-lg font-semibold">{task.description}</h4>
                      <p className="text-gray-600">Deadline: {new Date(task.deadline).toLocaleDateString()}</p>
                      <select
                        value={task.status}
                        onChange={(e) => updateTaskStatus(task._id, e.target.value)}
                        className={`w-full p-2 mt-2 rounded ${
                          task.status === 'Pending' ? 'bg-yellow-200' :
                          task.status === 'In Progress' ? 'bg-blue-200' :
                          'bg-green-200'
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                  )) || "No tasks available"}
                </div>
              </div>
            )}

            <div className="bg-white p-6 rounded shadow-md mb-4">
              <h3 className="text-xl font-semibold mb-4">Tasks</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {team.tasks?.map(task => (
                  <div key={task._id} className="bg-gray-100 p-4 rounded shadow-md">
                    <h4 className="text-lg font-semibold">{task.description}</h4>
                    <p className="text-gray-600">Assigned to: {task.assignedTo?.name || "Unassigned"}</p>
                    <p className="text-gray-600">Deadline: {new Date(task.deadline).toLocaleDateString()}</p>
                    <p className={`text-sm font-medium mt-2 ${
                      task.status === 'Pending' ? 'text-yellow-500' :
                      task.status === 'In Progress' ? 'text-blue-500' :
                      'text-green-500'
                    }`}>
                      {task.status}
                    </p>
                  </div>
                )) || "No tasks available"}
              </div>
              {(user.role === 'Team Leader' || user.role === 'Department Manager') && (
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
              )}
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
