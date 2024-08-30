import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaUsers, FaRegListAlt, FaInfoCircle, FaEye } from 'react-icons/fa';
import AuthContext from '../context/AuthContext';
import Sidebar from './Sidebar';

const MyTeam = () => {
  const { user } = useContext(AuthContext);
  const [teamMembers, setTeamMembers] = useState([]);
  const [teams, setTeams] = useState([]);
  const navigate = useNavigate();

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
      <div className="flex-1 bg-gray-100 overflow-y-auto p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
          <FaUsers className="mr-3 text-blue-500" />
          My Team
        </h1>
        
        <div className="overflow-x-auto">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4 flex items-center">
            <FaRegListAlt className="mr-2 text-blue-500" />
            Team Members
          </h2>
          <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Position</th>
                <th className="px-4 py-3 text-left">Department</th>
                <th className="px-4 py-3 text-left">Role</th>
              </tr>
            </thead>
            <tbody>
              {teamMembers.map((member) => (
                <tr key={member._id} className="hover:bg-gray-50 transition">
                  <td className="border-t px-4 py-3">{member.name}</td>
                  <td className="border-t px-4 py-3">{member.position}</td>
                  <td className="border-t px-4 py-3">{member.department.name}</td>
                  <td className="border-t px-4 py-3">{member.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="overflow-x-auto mt-10">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4 flex items-center">
            <FaInfoCircle className="mr-2 text-blue-500" />
            Teams
          </h2>
          {teams.length > 0 ? (
            <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg">
              <thead className="bg-gray-200 text-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left">Team Name</th>
                  <th className="px-4 py-3 text-left">Objective</th>
                  <th className="px-4 py-3 text-left">Description</th>
                  <th className="px-4 py-3 text-left">Department</th>
                  <th className="px-4 py-3 text-left">Role</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {teams.map((team) => (
                  <tr key={team._id} className="hover:bg-gray-50 transition">
                    <td className="border-t px-4 py-3">{team.name}</td>
                    <td className="border-t px-4 py-3">{team.objective}</td>
                    <td className="border-t px-4 py-3">{team.description}</td>
                    <td className="border-t px-4 py-3">{team.department.name}</td>
                    <td className="border-t px-4 py-3">
                      {team.teamLeader._id === user._id ? 'Team Leader' : 'Member'}
                    </td>
                    <td className="border-t px-4 py-3">
                      <button
                        onClick={() => navigate(`/team-details/${team._id}`)}
                        className="bg-blue-500 text-white p-2 rounded-lg flex items-center justify-center hover:bg-blue-600 transition"
                      >
                        <FaEye className="mr-1" />
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-600 mt-4">No teams assigned yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyTeam;
