import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

  useEffect(() => {
    fetchTeamDetails();
  }, []);

  const fetchTeamDetails = async () => {
    try {
      const response = await api.get(`/teams/${id}`);
      setTeam(response.data);
    } catch (error) {
      console.error('Error fetching team details:', error);
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
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const addComment = async () => {
    try {
      await api.post(`/teams/${id}/comment`, { comment: newComment });
      fetchTeamDetails(); // Refresh the team details after adding a comment
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6">
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
              <p>{team.members.map(member => member.name).join(', ')}</p>
            </div>

            <div className="bg-white p-6 rounded shadow-md mb-4">
              <h3 className="text-xl font-semibold mb-4">Tasks</h3>
              <ul>
                {team.tasks.map(task => (
                  <li key={task._id}>
                    {task.description} - {task.assignedTo.name} - {new Date(task.deadline).toLocaleDateString()}
                  </li>
                ))}
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
                  {team.members.map(member => (
                    <option key={member._id} value={member._id}>
                      {member.name}
                    </option>
                  ))}
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
                {team.discussions.map(discussion => (
                  <li key={discussion._id}>
                    {discussion.user.name}: {discussion.comment} - {new Date(discussion.createdAt).toLocaleString()}
                  </li>
                ))}
              </ul>
              <div className="mt-4">
                <h4 className="text-lg font-semibold mb-2">Add New Comment</h4>
                <textarea
                  placeholder="Comment"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded mb-4"
                />
                <button onClick={addComment} className="bg-blue-500 text-white p-2 rounded w-full">
                  Add Comment
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
