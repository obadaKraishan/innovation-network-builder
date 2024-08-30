import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
      <div className="flex-1 bg-gray-100 overflow-y-auto p-6">
        <h2 className="text-2xl font-bold mb-6">Manage Teams</h2>
        <div className="bg-white p-6 rounded shadow-md">
          <h3 className="text-xl font-semibold mb-4">Create a New Team</h3>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Team Name</label>
            <input
              type="text"
              placeholder="Team Name"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Team Objective</label>
            <input
              type="text"
              placeholder="Team Objective"
              value={teamObjective}
              onChange={(e) => setTeamObjective(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Team Description</label>
            <textarea
              placeholder="Team Description"
              value={teamDescription}
              onChange={(e) => setTeamDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Team Members</label>
            <select
              multiple
              value={members}
              onChange={(e) => setMembers([...e.target.selectedOptions].map(option => option.value))}
              className="w-full p-2 border border-gray-300 rounded"
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
            className="bg-blue-500 text-white p-2 rounded w-full"
          >
            Create Team
          </button>
        </div>
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">My Teams</h3>
          {teams.length > 0 ? (
            teams.map(team => (
              <div key={team._id} className="mb-4 p-4 border border-gray-300 rounded shadow-sm">
                <h4 className="text-lg font-bold">{team.name}</h4>
                <p>{team.objective}</p>
                <p>{team.description}</p>
                <p>Members: {team.members.map(member => member.name).join(', ')}</p>
                <button
                  onClick={() => handleViewTeam(team._id)}
                  className="bg-green-500 text-white p-2 rounded mt-2"
                >
                  View/Edit Team
                </button>
              </div>
            ))
          ) : (
            <p>No teams have been created yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageTeam;
