import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import Sidebar from './Sidebar';  // Import the Sidebar component

const MyTeam = () => {
  const { user } = useContext(AuthContext);
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      console.log('Fetching team members...');
      try {
        console.log('Sending request to API with token:', localStorage.getItem('token'));
        const { data } = await axios.get('http://localhost:5001/api/users/my-team', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        console.log('Team members data received:', data);
        setTeamMembers(data);
      } catch (error) {
        console.error('Failed to fetch team members', error);
        if (error.response) {
          console.log('Error Response:', error.response.data);
        }
      }
    };
  
    if (user) {
      fetchTeamMembers();
    }
  }, [user]);  

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex h-screen">
      <Sidebar />  {/* Include Sidebar component */}
      <div className="flex-1 p-6 bg-gray-100 overflow-y-auto">
        <h1 className="text-2xl mb-4">My Team</h1>
        <div className="overflow-x-auto">
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
      </div>
    </div>
  );
};

export default MyTeam;
