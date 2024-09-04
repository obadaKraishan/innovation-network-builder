import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Select from 'react-select';
import { FaSave, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../utils/api';
import 'react-toastify/dist/ReactToastify.css';

const EditInterestGroup = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [objectives, setObjectives] = useState('');
  const [hobbies, setHobbies] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [userOptions, setUserOptions] = useState([]);

  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        const { data } = await api.get(`/groups/${id}`);
        setName(data.name);
        setDescription(data.description);
        setObjectives(data.objectives);
        setHobbies(data.hobbies.map(hobby => ({ value: hobby, label: hobby })));
        setSelectedMembers(data.members.map(member => ({
          value: member._id,
          label: `${member.name} (${member.email})`
        })));
      } catch (error) {
        console.error('Error fetching group details:', error);
        toast.error('Error fetching group details.');
      }
    };

    const fetchUsers = async () => {
      try {
        const { data } = await api.get('/users');
        const options = data.map(user => ({
          value: user._id,
          label: `${user.name} (${user.email})`,
        }));
        setUserOptions(options);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Error fetching users.');
      }
    };

    fetchGroupDetails();
    fetchUsers();
  }, [id]);

  const validateForm = () => {
    if (!name) {
      toast.error('Group name is required');
      return false;
    }
    if (!description) {
      toast.error('Description is required');
      return false;
    }
    if (!objectives) {
      toast.error('Objectives are required');
      return false;
    }
    if (hobbies.length === 0) {
      toast.error('At least one hobby is required');
      return false;
    }
    if (selectedMembers.length === 0) {
      toast.error('At least one member must be selected');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const groupData = {
      name,
      description,
      objectives,
      hobbies: hobbies.map(hobby => hobby.value),
      members: selectedMembers.map(member => member.value),
    };

    try {
      await api.put(`/groups/${id}`, groupData);
      toast.success('Group updated successfully!');
      navigate(`/interest-groups/${id}`);
    } catch (error) {
      console.error('Error updating group:', error);
      toast.error('Error updating group.');
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100 overflow-y-auto">
        <h2 className="text-3xl font-semibold mb-6">Edit Interest Group</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Group Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Objectives</label>
            <textarea
              value={objectives}
              onChange={(e) => setObjectives(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Hobbies</label>
            <Select
              isMulti
              value={hobbies}
              onChange={setHobbies}
              options={[
                { value: 'reading', label: 'Reading' },
                { value: 'gaming', label: 'Gaming' },
                { value: 'coding', label: 'Coding' },
                { value: 'sports', label: 'Sports' },
              ]}
              className="w-full"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Invite Members</label>
            <Select
              isMulti
              value={selectedMembers}
              onChange={setSelectedMembers}
              options={userOptions}
              className="w-full"
              required
            />
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-600 transition"
            >
              <FaSave className="mr-2" /> Save
            </button>
            <button
              type="button"
              onClick={() => navigate(`/interest-groups/${id}`)}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-gray-600 transition"
            >
              <FaTimes className="mr-2" /> Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditInterestGroup;
