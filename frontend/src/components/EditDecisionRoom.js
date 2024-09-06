// File: frontend/src/components/EditDecisionRoom.js

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import api from '../utils/api';
import Select from 'react-select';
import { toast } from 'react-toastify';

const EditDecisionRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [decisionRoomName, setDecisionRoomName] = useState('');
  const [members, setMembers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [votingType, setVotingType] = useState('approval');
  const [isPrivate, setIsPrivate] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const { data } = await api.get(`/decisions/${id}`);
        setDecisionRoomName(data.decisionRoomName);
        setMembers(
          data.members.map((member) => ({
            label: member.name || 'Unknown',  // Handle undefined names
            value: member._id || `Unknown-${Math.random()}`, // Handle missing or undefined member IDs
            key: member._id || `Unknown-${Math.random()}`,  // Ensure key is unique
          }))
        );
        setVotingType(data.votingType);
        setIsPrivate(data.isPrivate);

        // Fetch all users for the members dropdown
        const users = await api.get('/users');
        setAllUsers(
          users.data.map((user) => ({
            label: user.name || 'Unknown',  // Handle undefined names
            value: user._id || `Unknown-${Math.random()}`,  // Handle missing or undefined user IDs
            key: user._id || `Unknown-${Math.random()}`,  // Ensure key is unique
          }))
        );
        setLoading(false);
      } catch (error) {
        toast.error('Failed to load decision room details');
        navigate('/decision-rooms');
      }
    };

    fetchRoomDetails();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/decisions/edit/${id}`, {
        decisionRoomName,
        isPrivate,
        votingType,
        members: members.map((member) => member.value),  // Extract member IDs
      });
      toast.success('Decision room updated successfully!');
      navigate(`/decision-rooms/${id}`);
    } catch (error) {
      toast.error('Failed to update decision room');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100">
        <h1 className="text-2xl font-bold mb-6">Edit Decision Room</h1>
        <form onSubmit={handleSubmit} className="bg-white p-6 shadow rounded-lg">
          <div className="mb-4">
            <label className="block text-gray-700">Decision Room Name</label>
            <input
              type="text"
              value={decisionRoomName}
              onChange={(e) => setDecisionRoomName(e.target.value)}
              className="w-full p-3 border rounded-lg"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Members</label>
            <Select
              isMulti
              value={members}
              onChange={setMembers}
              options={allUsers}
              className="w-full"
              getOptionValue={(option) => option.value}
              getOptionLabel={(option) => option.label || 'Unknown'}  // Handle missing labels
              key={option => option.key} // Ensure each option has a unique key
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Voting Type</label>
            <select
              value={votingType}
              onChange={(e) => setVotingType(e.target.value)}
              className="w-full p-3 border rounded-lg"
            >
              <option value="approval">Approval (Approve/Reject)</option>
              <option value="ranking">Ranking</option>
              <option value="rating">Rating (1-5)</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={() => setIsPrivate(!isPrivate)}
                className="mr-2"
              />
              Private Room
            </label>
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Update Room
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditDecisionRoom;
