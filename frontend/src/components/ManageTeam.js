import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUsers, FaRegClipboard, FaUserPlus, FaRegEye } from 'react-icons/fa';
import api from '../utils/api';
import Sidebar from './Sidebar';

const ManageTeam = () => {
  const [teams, setTeams] = useState([]);
  const [teamName, setTeamName] = useState('');
  const [teamObjective, setTeamObjective] = useState('');
  const [teamDescription, setTeamDescription] = useState('');
  const [members, setMembers] = useState([]);
  const [availableEmployees, setAvailableEmployees] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Fetching teams and available employees...');
    fetchTeams();
    fetchAvailableEmployees();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await api.get('/teams');
      console.log('Teams fetched:', response.data);
      setTeams(response.data);
    } catch (error) {
      console.error('Error fetching teams:', error);
      setTeams([]); // Ensuring that the teams array is empty if there was an error
    }
  };

  const fetchAvailableEmployees = async () => {
    try {
      const response = await api.get('/users/department-users'); // Updated API endpoint
      console.log('Available employees fetched:', response.data);
      setAvailableEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
      setAvailableEmployees([]); // Ensuring that the availableEmployees array is empty if there was an error
    }
  };

  const createTeam = async () => {
    try {
      console.log('Creating team...');
      const response = await api.post('/teams/create', {
        name: teamName,
        members,
        objective: teamObjective,
        description: teamDescription,
      });
      console.log('Team created:', response.data);
      setTeams([...teams, response.data]);
    } catch (error) {
      console.error('Error creating team:', error);
    }
  };

  const handleViewTeam = (teamId) => {
    navigate(`/team-details/${teamId}`);
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 bg-gray-50 p-6 overflow-y-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
          <FaUsers className="mr-3 text-blue-500" /> Manage Teams
        </h2>
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold text-gray-700 mb-6 flex items-center">
            <FaRegClipboard className="mr-2 text-green-500" /> Create a New Team
          </h3>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Team Name</label>
            <input
              type="text"
              placeholder="Team Name"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Team Objective</label>
            <input
              type="text"
              placeholder="Team Objective"
              value={teamObjective}
              onChange={(e) => setTeamObjective(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Team Description</label>
            <textarea
              placeholder="Team Description"
              value={teamDescription}
              onChange={(e) => setTeamDescription(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Team Members</label>
            <select
              multiple
              value={members}
              onChange={(e) => setMembers([...e.target.selectedOptions].map(option => option.value))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500"
            >
              {availableEmployees.map(employee => (
                <option key={employee._id} value={employee._id}>
                  {employee.name}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={createTeam}
            className="w-full bg-blue-500 text-white p-3 rounded-lg font-semibold hover:bg-blue-600 transition"
          >
            <FaUserPlus className="inline-block mr-2" /> Create Team
          </button>
        </div>
        <div className="mt-12">
          <h3 className="text-2xl font-semibold text-gray-700 mb-6 flex items-center">
            <FaUsers className="mr-2 text-purple-500" /> My Teams
          </h3>
          {teams.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teams.map(team => (
                <div key={team._id} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                  <h4 className="text-xl font-bold text-gray-800 mb-2">{team.name}</h4>
                  <p className="text-gray-600 mb-4"><strong>Objective:</strong> {team.objective}</p>
                  <p className="text-gray-600 mb-4"><strong>Description:</strong> {team.description}</p>
                  <p className="text-gray-600 mb-4"><strong>Members:</strong> {team.members.map(member => member.name).join(', ')}</p>
                  <button
                    onClick={() => handleViewTeam(team._id)}
                    className="w-full bg-green-500 text-white p-2 rounded-lg font-semibold hover:bg-green-600 transition"
                  >
                    <FaRegEye className="inline-block mr-2" /> View/Edit Team
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No teams have been created yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageTeam;
