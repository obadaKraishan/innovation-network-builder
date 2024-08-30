import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaEdit, FaTrashAlt, FaArrowLeft, FaPlusCircle, FaTasks, FaUserTie, FaRegClock } from 'react-icons/fa';
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
        <div
          key={comment._id}
          style={{ marginLeft: level * 10, marginTop: 20 }}
          className={`mb-8 p-6 rounded-lg shadow-md ${
            level === 0 ? 'bg-gray-100 border border-gray-300' : 'bg-gray-200 border-l-4 border-blue-200'
          }`}
        >
          <div className="flex justify-between items-center mb-2">
            <p className="font-semibold text-gray-700">
              {comment.user?.name || "Unknown User"}:
            </p>
            <div className="text-xs text-gray-500 ml-4">
              {formatTimeAgo(comment.createdAt)}
            </div>
          </div>
          <p className="mt-2 text-gray-800">{comment.comment}</p>
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => setParentCommentId(comment._id)}
              className="text-xs text-blue-500 hover:underline py-1 px-2 rounded bg-gray-100 hover:bg-blue-100"
            >
              Reply
            </button>
            <div className="flex">
              <FaEdit
                className="text-blue-500 cursor-pointer mr-3"
                onClick={() => handleEditComment(comment)}
              />
              <FaTrashAlt
                className="text-red-500 cursor-pointer"
                onClick={() => handleDeleteComment(comment._id)}
              />
            </div>
          </div>
          {renderComments(comments, comment._id, level + 1)}
        </div>
      ));
  };

  const handleBackButtonClick = () => {
    if (user.role === 'Employee') {
      navigate('/my-team');
    } else {
      navigate('/manage-team');
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 bg-gray-100 overflow-y-auto p-6">
        <ToastContainer />
        <button
          onClick={handleBackButtonClick}
          className="mb-4 bg-blue-500 text-white py-2 px-4 rounded inline-flex items-center shadow-md hover:bg-blue-600 transition"
        >
          <FaArrowLeft className="mr-2" />
          Back
        </button>
        {team ? (
          <>
            <h2 className="text-3xl font-bold mb-6 text-gray-800">{team.name} - Team Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-4 text-gray-700 flex items-center">
                  <FaTasks className="mr-2 text-gray-500" /> Team Objective
                </h3>
                <p className="text-gray-600">{team.objective}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-4 text-gray-700 flex items-center">
                  <FaRegClock className="mr-2 text-gray-500" /> Team Description
                </h3>
                <p className="text-gray-600">{team.description}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-4 text-gray-700 flex items-center">
                  <FaUserTie className="mr-2 text-gray-500" /> Team Members
                </h3>
                <ul className="list-disc list-inside text-gray-600">
                  {team.members?.map(member => (
                    <li key={member._id}>{member.name}</li>
                  )) || <li>No members available</li>}
                </ul>
              </div>
            </div>

            {user.role === 'Employee' && (
              <div className="bg-white p-8 rounded-lg shadow-lg mb-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-700">My Tasks</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {team.tasks?.filter(task => task.assignedTo?._id === user._id).map(task => (
                    <div key={task._id} className="bg-gray-50 p-6 rounded-lg shadow-md">
                      <h4 className="text-lg font-semibold text-gray-700">{task.description}</h4>
                      <p className="text-gray-600 mt-2">Deadline: {new Date(task.deadline).toLocaleDateString()}</p>
                      <select
                        value={task.status}
                        onChange={(e) => updateTaskStatus(task._id, e.target.value)}
                        className={`w-full p-2 mt-4 rounded ${
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

            <div className="bg-white p-8 rounded-lg shadow-lg mb-8">
              <h3 className="text-xl font-semibold mb-4 text-gray-700">Tasks</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {team.tasks?.map(task => (
                  <div key={task._id} className="bg-gray-50 p-6 rounded-lg shadow-md">
                    <h4 className="text-lg font-semibold text-gray-700">{task.description}</h4>
                    <p className="text-gray-600 mt-2">Assigned to: {task.assignedTo?.name || "Unassigned"}</p>
                    <p className="text-gray-600 mt-2">Deadline: {new Date(task.deadline).toLocaleDateString()}</p>
                    <p className={`text-sm font-medium mt-4 ${
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
                <div className="mt-6">
                  <h4 className="text-lg font-semibold mb-4 text-gray-700 flex items-center">
                    <FaPlusCircle className="mr-2 text-green-500" /> Add New Task
                  </h4>
                  <input
                    type="text"
                    placeholder="Task Description"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded mb-4 focus:border-green-500"
                  />
                  <select
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded mb-4 focus:border-green-500"
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
                    className="w-full p-3 border border-gray-300 rounded mb-6 focus:border-green-500"
                  />
                  <button onClick={addTask} className="bg-green-500 text-white p-3 rounded w-full hover:bg-green-600 transition">
                    Add Task
                  </button>
                </div>
              )}
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-6 text-gray-700">Team Discussions</h3>
              <ul>
                {renderComments(team.discussions || [])}
              </ul>
              <div className="mt-6">
                <h4 className="text-lg font-semibold mb-4 text-gray-700">{editCommentId ? 'Edit Comment' : 'Add New Comment'}</h4>
                <textarea
                  placeholder="Comment"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded mb-6 focus:border-blue-500"
                />
                <button onClick={handleCommentSubmit} className="bg-blue-500 text-white p-3 rounded w-full hover:bg-blue-600 transition">
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
