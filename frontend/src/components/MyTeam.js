import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import AuthContext from '../context/AuthContext';
import Sidebar from './Sidebar';  // Import the Sidebar component

const MyTeam = () => {
  const { user } = useContext(AuthContext);
  const [teamMembers, setTeamMembers] = useState([]);
  const [teams, setTeams] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate for navigation

  useEffect(() => {
    const fetchTeams = async () => {
      console.log('Fetching team members and teams...');
      try {
        console.log('Sending request to API with token:', localStorage.getItem('token'));
        const { data } = await axios.get('http://localhost:5001/api/users/my-team', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        console.log('Data received:', data);
        setTeamMembers(data.teamMembers || []);
        setTeams(data.teams || []);
      } catch (error) {
        console.error('Failed to fetch teams', error);
        if (error.response) {
          console.log('Error Response:', error.response.data);
        }
      }
    };

    if (user) {
      fetchTeams();
    }
  }, [user]);

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100 overflow-y-auto">
        <h1 className="text-2xl mb-4">My Team</h1>
        <div className="overflow-x-auto">
          <h2 className="text-xl mb-4">Team Members</h2>
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Position</th>
                <th className="px-4 py-2">Department</th>
                <th className="px-4 py-2">Role</th>
              </tr>
            </thead>
            <tbody>
              {teamMembers.map((member) => (
                <tr key={member._id}>
                  <td className="border px-4 py-2">{member.name}</td>
                  <td className="border px-4 py-2">{member.position}</td>
                  <td className="border px-4 py-2">{member.department.name}</td>
                  <td className="border px-4 py-2">{member.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="overflow-x-auto mt-8">
          <h2 className="text-xl mb-4">Teams</h2>
          {teams.length > 0 ? (
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr>
                  <th className="px-4 py-2">Team Name</th>
                  <th className="px-4 py-2">Objective</th>
                  <th className="px-4 py-2">Description</th>
                  <th className="px-4 py-2">Department</th>
                  <th className="px-4 py-2">Role</th>
                  <th className="px-4 py-2">Actions</th> {/* Added this column for actions */}
                </tr>
              </thead>
              <tbody>
                {teams.map((team) => (
                  <tr key={team._id}>
                    <td className="border px-4 py-2">{team.name}</td>
                    <td className="border px-4 py-2">{team.objective}</td>
                    <td className="border px-4 py-2">{team.description}</td>
                    <td className="border px-4 py-2">{team.department.name}</td>
                    <td className="border px-4 py-2">
                      {team.teamLeader._id === user._id ? 'Team Leader' : 'Member'}
                    </td>
                    <td className="border px-4 py-2">
                      <button
                        onClick={() => navigate(`/team-details/${team._id}`)} // Navigate to the TeamDetails page
                        className="bg-blue-500 text-white p-2 rounded"
                      >
                        View Team Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No teams assigned yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyTeam;
