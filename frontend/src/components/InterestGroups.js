import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaPlus } from 'react-icons/fa';
import Select from 'react-select';
import api from '../utils/api';
import 'react-toastify/dist/ReactToastify.css';

const InterestGroups = () => {
  const [groups, setGroups] = useState([]);
  const [joinedGroups, setJoinedGroups] = useState([]);
  const [createdGroups, setCreatedGroups] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [hobbiesOptions, setHobbiesOptions] = useState([]);
  const [selectedHobbies, setSelectedHobbies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const { data } = await api.get('/groups');
        setGroups(data);
        // Separate the groups into joined and created by the user
        const user = JSON.parse(localStorage.getItem('userInfo'));
        setJoinedGroups(data.filter(group => group.members.some(member => member._id === user._id)));
        setCreatedGroups(data.filter(group => group.createdBy === user._id));
        // Extract unique hobbies for filter options
        const hobbies = [...new Set(data.flatMap(group => group.hobbies))];
        setHobbiesOptions(hobbies.map(hobby => ({ value: hobby, label: hobby })));
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    };

    fetchGroups();
  }, []);

  const handleSearch = (groups) => {
    return groups.filter(group => {
      const matchesSearchTerm = searchTerm
        ? group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          group.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          group.objectives.toLowerCase().includes(searchTerm.toLowerCase())
        : true;

      const matchesHobbies = selectedHobbies.length
        ? selectedHobbies.every(hobby => group.hobbies.includes(hobby.value))
        : true;

      return matchesSearchTerm && matchesHobbies;
    });
  };

  const filteredGroups = handleSearch(groups);
  const filteredJoinedGroups = handleSearch(joinedGroups);
  const filteredCreatedGroups = handleSearch(createdGroups);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100 overflow-y-auto">
        <h2 className="text-3xl font-semibold mb-6">Interest Groups</h2>
        <div className="flex justify-between mb-6">
          <div className="flex items-center w-1/3">
            <FaSearch className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search groups..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="w-1/3">
            <Select
              isMulti
              options={hobbiesOptions}
              value={selectedHobbies}
              onChange={setSelectedHobbies}
              placeholder="Filter by hobbies"
              className="w-full"
            />
          </div>
          <button
            onClick={() => navigate('/create-interest-group')}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg flex items-center hover:bg-blue-600 transition"
          >
            <FaPlus className="mr-2" /> Create New Group
          </button>
        </div>

        <h3 className="text-xl font-semibold mb-4">Available Groups</h3>
        <ul className="space-y-4">
          {filteredGroups.map(group => (
            <li
              key={group._id}
              className="p-4 bg-white rounded-lg shadow-lg flex justify-between items-center"
              onClick={() => navigate(`/interest-groups/${group._id}`)}
            >
              <div>
                <h4 className="text-lg font-bold">{group.name}</h4>
                <p className="text-gray-700">{group.description}</p>
                <p className="text-sm text-gray-500">Hobbies: {group.hobbies.join(', ')}</p>
              </div>
            </li>
          ))}
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-4">Groups You Have Joined</h3>
        <ul className="space-y-4">
          {filteredJoinedGroups.map(group => (
            <li
              key={group._id}
              className="p-4 bg-white rounded-lg shadow-lg flex justify-between items-center"
              onClick={() => navigate(`/interest-groups/${group._id}`)}
            >
              <div>
                <h4 className="text-lg font-bold">{group.name}</h4>
                <p className="text-gray-700">{group.description}</p>
                <p className="text-sm text-gray-500">Hobbies: {group.hobbies.join(', ')}</p>
              </div>
            </li>
          ))}
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-4">Groups You Have Created</h3>
        <ul className="space-y-4">
          {filteredCreatedGroups.map(group => (
            <li
              key={group._id}
              className="p-4 bg-white rounded-lg shadow-lg flex justify-between items-center"
              onClick={() => navigate(`/interest-groups/${group._id}`)}
            >
              <div>
                <h4 className="text-lg font-bold">{group.name}</h4>
                <p className="text-gray-700">{group.description}</p>
                <p className="text-sm text-gray-500">Hobbies: {group.hobbies.join(', ')}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default InterestGroups;
