// File: frontend/src/components/InnovationLeaderboard.js
import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import api from '../utils/api';
import { FaTrophy } from 'react-icons/fa';

const InnovationLeaderboard = () => {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const { data } = await api.get('/innovation/leaderboard');
        setLeaders(data);
      } catch (error) {
        console.error('Failed to fetch leaderboard', error);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-6">Innovation Leaderboard</h1>

          <table className="min-w-full bg-white shadow-lg rounded-lg">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Rank</th>
                <th className="py-2 px-4 border-b">Employee</th>
                <th className="py-2 px-4 border-b">Ideas Submitted</th>
                <th className="py-2 px-4 border-b">Ideas Approved</th>
                <th className="py-2 px-4 border-b">Ideas Implemented</th>
              </tr>
            </thead>
            <tbody>
              {leaders.map((leader, index) => (
                <tr key={leader._id}>
                  <td className="py-2 px-4 border-b">
                    <FaTrophy className={`text-yellow-500 ${index === 0 ? '' : 'hidden'}`} /> {index + 1}
                  </td>
                  <td className="py-2 px-4 border-b">{leader.name}</td>
                  <td className="py-2 px-4 border-b">{leader.ideasSubmitted}</td>
                  <td className="py-2 px-4 border-b">{leader.ideasApproved}</td>
                  <td className="py-2 px-4 border-b">{leader.ideasImplemented}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InnovationLeaderboard;
