import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';  // Import Sidebar
import api from '../utils/api';
import { FaPlus, FaFolderOpen, FaArchive } from 'react-icons/fa';
import { toast } from 'react-toastify';

const DecisionRoomsDashboard = () => {
  const [activeRooms, setActiveRooms] = useState([]);
  const [archivedRooms, setArchivedRooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDecisionRooms = async () => {
      try {
        const { data } = await api.get('/decisions');
        setActiveRooms(data.filter(room => room.status === 'active'));
        setArchivedRooms(data.filter(room => room.status === 'archived'));
      } catch (error) {
        toast.error('Failed to fetch decision rooms');
        console.error('Error fetching decision rooms:', error);
      }
    };

    fetchDecisionRooms();
  }, []);

  return (
    <div className="flex h-screen">
      <Sidebar />  {/* Add Sidebar here */}
      <div className="flex-1 p-6 bg-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Decision Rooms</h1>
          <button
            onClick={() => navigate('/create-decision-room')}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <FaPlus className="mr-2" /> Create New Room
          </button>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Active Decision Rooms</h2>
          {activeRooms.length > 0 ? (
            <ul>
              {activeRooms.map(room => (
                <li key={room._id} className="bg-white p-4 shadow rounded-lg mb-4">
                  <Link to={`/decision-rooms/${room._id}`} className="text-lg font-bold">
                    <FaFolderOpen className="mr-2" />
                    {room.decisionRoomName}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>No active decision rooms available.</p>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Archived Decision Rooms</h2>
          {archivedRooms.length > 0 ? (
            <ul>
              {archivedRooms.map(room => (
                <li key={room._id} className="bg-gray-200 p-4 shadow rounded-lg mb-4">
                  <Link to={`/decision-rooms/${room._id}`} className="text-lg font-bold">
                    <FaArchive className="mr-2" />
                    {room.decisionRoomName}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>No archived decision rooms available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DecisionRoomsDashboard;
