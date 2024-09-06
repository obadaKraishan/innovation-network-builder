import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import api from '../utils/api';
import { FaPlus, FaFolderOpen, FaArchive, FaSearch, FaSortAmountUp, FaSortAmountDown } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Select from 'react-select';
import Tooltip from 'react-tooltip';

const DecisionRoomsDashboard = () => {
  const [activeRooms, setActiveRooms] = useState([]);
  const [archivedRooms, setArchivedRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isPrivateFilter, setIsPrivateFilter] = useState(null);
  const [votingTypeFilter, setVotingTypeFilter] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const navigate = useNavigate();

  const votingTypeOptions = [
    { value: 'approval', label: 'Approval' },
    { value: 'ranking', label: 'Ranking' },
    { value: 'rating', label: 'Rating' },
  ];

  const privacyOptions = [
    { value: true, label: 'Private' },
    { value: false, label: 'Public' },
  ];

  useEffect(() => {
    const fetchDecisionRooms = async () => {
      try {
        const { data } = await api.get('/decisions');
        setActiveRooms(data.filter(room => room.status === 'active'));
        setArchivedRooms(data.filter(room => room.status === 'archived'));
        setFilteredRooms(data.filter(room => room.status === 'active')); // Default to active rooms
      } catch (error) {
        toast.error('Failed to fetch decision rooms');
        console.error('Error fetching decision rooms:', error);
      }
    };

    fetchDecisionRooms();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = activeRooms.filter((room) =>
      room.decisionRoomName.toLowerCase().includes(value)
    );
    setFilteredRooms(filtered);
  };

  const handleFilterChange = () => {
    let filtered = activeRooms;

    if (isPrivateFilter !== null) {
      filtered = filtered.filter(room => room.isPrivate === isPrivateFilter.value);
    }

    if (votingTypeFilter !== null) {
      filtered = filtered.filter(room => room.votingType === votingTypeFilter.value);
    }

    if (searchTerm) {
      filtered = filtered.filter(room =>
        room.decisionRoomName.toLowerCase().includes(searchTerm)
      );
    }

    setFilteredRooms(filtered);
  };

  const handleSort = () => {
    const sortedRooms = [...filteredRooms].sort((a, b) => {
      if (sortOrder === 'asc') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });
    setFilteredRooms(sortedRooms);
  };

  useEffect(() => {
    handleFilterChange();
  }, [isPrivateFilter, votingTypeFilter, searchTerm]);

  useEffect(() => {
    handleSort();
  }, [sortOrder, filteredRooms]);

  return (
    <div className="flex h-screen">
      <Sidebar />
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

        {/* Search and Filters */}
        <div className="flex mb-6">
          <div className="flex items-center w-full">
            <FaSearch className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search rooms..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="ml-4">
            <Select
              placeholder="Filter by privacy"
              options={privacyOptions}
              onChange={setIsPrivateFilter}
              isClearable
            />
          </div>

          <div className="ml-4">
            <Select
              placeholder="Filter by voting type"
              options={votingTypeOptions}
              onChange={setVotingTypeFilter}
              isClearable
            />
          </div>

          {/* Sorting Toggle */}
          <button
            className="ml-4 bg-gray-200 px-3 py-2 rounded-lg flex items-center"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          >
            {sortOrder === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />}
            <span className="ml-2">Sort by Date</span>
          </button>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Active Decision Rooms</h2>
          {filteredRooms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRooms.map((room) => (
                <div key={room._id} className="bg-white p-6 shadow-lg rounded-lg transition-transform transform hover:scale-105 hover:shadow-xl">
                  <div className="flex justify-between items-center mb-4">
                    <Link
                      to={`/decision-rooms/${room._id}`}
                      className="text-lg font-bold text-blue-600"
                      data-tip="Click to view room details"
                    >
                      <FaFolderOpen className="mr-2" />
                      {room.decisionRoomName}
                    </Link>
                    <span
                      className={`px-2 py-1 rounded-lg text-sm ${
                        room.isPrivate ? 'bg-red-500' : 'bg-green-500'
                      } text-white`}
                    >
                      {room.isPrivate ? 'Private' : 'Public'}
                    </span>
                  </div>
                  <p className="text-gray-600">
                    Voting Type: <strong>{room.votingType}</strong>
                  </p>
                  <p className="text-gray-600">
                    Members: <strong>{room.members.length}</strong>
                  </p>
                  <p className="text-gray-600">
                    Created: <strong>{new Date(room.createdAt).toLocaleDateString()}</strong>
                  </p>
                  {/* Tooltip for extra information */}
                  <div className="mt-2">
                    <span className="text-blue-500 hover:underline" data-tip="New proposals are available!">
                      Check Proposals
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No active decision rooms available.</p>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Archived Decision Rooms</h2>
          {archivedRooms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {archivedRooms.map((room) => (
                <div key={room._id} className="bg-gray-200 p-6 shadow-lg rounded-lg transition-transform transform hover:scale-105 hover:shadow-xl">
                  <div className="flex justify-between items-center mb-4">
                    <Link
                      to={`/decision-rooms/${room._id}`}
                      className="text-lg font-bold text-blue-600"
                      data-tip="Click to view room details"
                    >
                      <FaArchive className="mr-2" />
                      {room.decisionRoomName}
                    </Link>
                    <span className="px-2 py-1 rounded-lg text-sm bg-gray-500 text-white">
                      Archived
                    </span>
                  </div>
                  <p className="text-gray-600">
                    Voting Type: <strong>{room.votingType}</strong>
                  </p>
                  <p className="text-gray-600">
                    Members: <strong>{room.members.length}</strong>
                  </p>
                  <p className="text-gray-600">
                    Created: <strong>{new Date(room.createdAt).toLocaleDateString()}</strong>
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p>No archived decision rooms available.</p>
          )}
        </div>
        <Tooltip effect="solid" />
      </div>
    </div>
  );
};

export default DecisionRoomsDashboard;
