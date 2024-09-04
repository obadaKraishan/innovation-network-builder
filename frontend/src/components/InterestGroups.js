import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaPlus, FaEnvelopeOpenText, FaEye, FaEdit, FaTrash, FaSignOutAlt } from 'react-icons/fa';
import Select from 'react-select';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import api from '../utils/api';
import 'react-toastify/dist/ReactToastify.css';

const InterestGroups = () => {
  const [groups, setGroups] = useState([]);
  const [joinedGroups, setJoinedGroups] = useState([]);
  const [createdGroups, setCreatedGroups] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [hobbiesOptions, setHobbiesOptions] = useState([]);
  const [selectedHobbies, setSelectedHobbies] = useState([]);
  const [showMoreGroups, setShowMoreGroups] = useState(false);
  const [showMoreJoined, setShowMoreJoined] = useState(false);
  const [showMoreCreated, setShowMoreCreated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const { data } = await api.get('/groups');
        setGroups(data);

        // Separate the groups into joined and created by the user
        const user = JSON.parse(localStorage.getItem('userInfo'));
        setJoinedGroups(data.filter(group => group.members.some(member => member._id === user._id)));
        setCreatedGroups(data.filter(group => group.createdBy._id === user._id));

        // Extract unique hobbies for filter options
        const hobbies = [...new Set(data.flatMap(group => group.hobbies))];
        setHobbiesOptions(hobbies.map(hobby => ({ value: hobby, label: hobby })));
      } catch (error) {
        console.error('Error fetching groups:', error);
        toast.error('Error fetching groups.');
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

  const visibleGroups = showMoreGroups ? filteredGroups : filteredGroups.slice(0, 6);
  const visibleJoinedGroups = showMoreJoined ? filteredJoinedGroups : filteredJoinedGroups.slice(0, 6);
  const visibleCreatedGroups = showMoreCreated ? filteredCreatedGroups : filteredCreatedGroups.slice(0, 6);

  const handleLeaveGroup = (groupId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you really want to leave this group?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, leave it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.put(`/groups/${groupId}/leave`); // Use groupId instead of id
          setJoinedGroups(joinedGroups.filter(group => group._id !== groupId));
          toast.success('You have left the group.');
        } catch (error) {
          console.error('Error leaving group:', error);
          toast.error('Failed to leave the group.');
        }
      }
    });
  };  

  const handleDeleteGroup = async (groupId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/groups/${groupId}`);
          setCreatedGroups(createdGroups.filter(group => group._id !== groupId));
          toast.success('Group deleted successfully.');
        } catch (error) {
          console.error('Error deleting group:', error);
          toast.error('Failed to delete the group.');
        }
      }
    });
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100 overflow-y-auto">
        <h2 className="text-3xl font-semibold mb-6">Interest Groups</h2>
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <FaSearch className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search groups..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-2/3 p-2 border border-gray-300 rounded-lg mr-4"
            />
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
          </div>
          <div className="flex justify-between">
            <button
              onClick={() => navigate('/create-interest-group')}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg flex items-center hover:bg-blue-600 transition"
            >
              <FaPlus className="mr-2" /> Create New Group
            </button>
            <button
              onClick={() => navigate('/group-invitations')}
              className="bg-green-500 text-white px-6 py-3 rounded-lg flex items-center hover:bg-green-600 transition"
            >
              <FaEnvelopeOpenText className="mr-2" /> Invitations
            </button>
          </div>
        </div>

        <h3 className="text-xl font-semibold mb-4">Available Groups</h3>
        {visibleGroups.length > 0 ? (
          <ul className="space-y-4">
            {visibleGroups.map(group => (
              <li
                key={group._id}
                className="p-4 bg-white rounded-lg shadow-lg flex justify-between items-center"
              >
                <div>
                  <h4 className="text-lg font-bold">{group.name}</h4>
                  <p className="text-gray-700">{group.description}</p>
                  <p className="text-sm text-gray-500">Hobbies: {group.hobbies.join(', ')}</p>
                  <p className="text-sm text-gray-500">Members: {group.members.map(member => member.name).join(', ')}</p>
                  <p className="text-sm text-gray-500">Created by: {group.createdBy.name}</p>
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={() => navigate(`/interest-groups/${group._id}`)}
                    className="text-blue-500 hover:text-blue-700"
                    title="View Details"
                  >
                    <FaEye size={20} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No available groups to display.</p>
        )}
        {filteredGroups.length > 6 && !showMoreGroups && (
          <button
            onClick={() => setShowMoreGroups(true)}
            className="text-blue-500 hover:underline mt-4"
          >
            Show More
          </button>
        )}

        <h3 className="text-xl font-semibold mt-8 mb-4">Groups You Have Joined</h3>
        {visibleJoinedGroups.length > 0 ? (
          <ul className="space-y-4">
            {visibleJoinedGroups.map(group => (
              <li
                key={group._id}
                className="p-4 bg-white rounded-lg shadow-lg flex justify-between items-center"
              >
                <div>
                  <h4 className="text-lg font-bold">{group.name}</h4>
                  <p className="text-gray-700">{group.description}</p>
                  <p className="text-sm text-gray-500">Hobbies: {group.hobbies.join(', ')}</p>
                  <p className="text-sm text-gray-500">Members: {group.members.map(member => member.name).join(', ')}</p>
                  <p className="text-sm text-gray-500">Created by: {group.createdBy.name}</p>
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={() => navigate(`/interest-groups/${group._id}`)}
                    className="text-blue-500 hover:text-blue-700"
                    title="View Details"
                  >
                    <FaEye size={20} />
                  </button>
                  {/* Show Leave Group button for joined groups */}
                  <button
                    onClick={() => handleLeaveGroup(group._id)}
                    className="text-red-500 hover:text-red-700"
                    title="Leave Group"
                  >
                    <FaSignOutAlt size={20} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">You haven't joined any groups yet.</p>
        )}
        {filteredJoinedGroups.length > 6 && !showMoreJoined && (
          <button
            onClick={() => setShowMoreJoined(true)}
            className="text-blue-500 hover:underline mt-4"
          >
            Show More
          </button>
        )}

        <h3 className="text-xl font-semibold mt-8 mb-4">Groups You Have Created</h3>
        {visibleCreatedGroups.length > 0 ? (
          <ul className="space-y-4">
            {visibleCreatedGroups.map(group => (
              <li
                key={group._id}
                className="p-4 bg-white rounded-lg shadow-lg flex justify-between items-center"
              >
                <div>
                  <h4 className="text-lg font-bold">{group.name}</h4>
                  <p className="text-gray-700">{group.description}</p>
                  <p className="text-sm text-gray-500">Hobbies: {group.hobbies.join(', ')}</p>
                  <p className="text-sm text-gray-500">Members: {group.members.map(member => member.name).join(', ')}</p>
                  <p className="text-sm text-gray-500">Created by: {group.createdBy.name}</p>
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={() => navigate(`/interest-groups/${group._id}`)}
                    className="text-blue-500 hover:text-blue-700"
                    title="View Details"
                  >
                    <FaEye size={20} />
                  </button>
                  <button
                    onClick={() => navigate(`/edit-interest-group/${group._id}`)} // Update this route
                    className="text-yellow-500 hover:text-yellow-700"
                    title="Edit Group"
                  >
                    <FaEdit size={20} />
                  </button>
                  <button
                    onClick={() => handleDeleteGroup(group._id)}
                    className="text-red-500 hover:text-red-700"
                    title="Delete Group"
                  >
                    <FaTrash size={20} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">You haven't created any groups yet.</p>
        )}
        {filteredCreatedGroups.length > 6 && !showMoreCreated && (
          <button
            onClick={() => setShowMoreCreated(true)}
            className="text-blue-500 hover:underline mt-4"
          >
            Show More
          </button>
        )}
      </div>
    </div>
  );
};

export default InterestGroups;
