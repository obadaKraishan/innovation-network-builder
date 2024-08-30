import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Sidebar from './Sidebar';

const EditDepartment = () => {
  const { id } = useParams(); // Get the department ID from the URL
  const navigate = useNavigate();

  const [department, setDepartment] = useState(null);
  const [departmentName, setDepartmentName] = useState('');
  const [subDepartments, setSubDepartments] = useState([]);
  const [newSubDepartment, setNewSubDepartment] = useState('');
  const [members, setMembers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');

  useEffect(() => {
    fetchDepartment();
    fetchAllUsers();
  }, [id]);

  const fetchDepartment = async () => {
    try {
      const { data } = await api.get(`/departments/${id}`);
      setDepartment(data);
      setDepartmentName(data.name);
      setSubDepartments(data.subDepartments);
      fetchMembers(data._id); // Fetch members related to this department
    } catch (error) {
      console.error('Error fetching department:', error);
    }
  };

  const fetchMembers = async (departmentId) => {
    try {
      const { data } = await api.get(`/users/department-users?department=${departmentId}`);
      setMembers(data);
    } catch (error) {
      console.error('Error fetching department members:', error);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const { data } = await api.get('/users');
      setAllUsers(data);
    } catch (error) {
      console.error('Error fetching all users:', error);
    }
  };

  const handleSaveChanges = async () => {
    try {
      await api.put(`/departments/${id}`, { name: departmentName });
      navigate('/manage-departments');
    } catch (error) {
      console.error('Error saving department changes:', error);
    }
  };

  const handleAddSubDepartment = async () => {
    try {
      const { data } = await api.post('/departments', { name: newSubDepartment, parent: id });
      setSubDepartments([...subDepartments, data]);
      setNewSubDepartment('');
    } catch (error) {
      console.error('Error adding sub-department:', error);
    }
  };

  const handleRemoveSubDepartment = async (subDeptId) => {
    try {
      await api.delete(`/departments/${subDeptId}`);
      setSubDepartments(subDepartments.filter((subDept) => subDept._id !== subDeptId));
    } catch (error) {
      console.error('Error removing sub-department:', error);
    }
  };

  const handleAddMember = async () => {
    try {
      const user = allUsers.find(user => user._id === selectedUser);
      if (user) {
        await api.put(`/users/${selectedUser}`, { department: id });
        setMembers([...members, user]);
        setSelectedUser('');
      }
    } catch (error) {
      console.error('Error adding member to department:', error);
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Edit Department</h1>

        {department && (
          <>
            <div className="mb-6">
              <label className="block text-lg font-semibold text-gray-700">Department Name:</label>
              <input
                type="text"
                value={departmentName}
                onChange={(e) => setDepartmentName(e.target.value)}
                className="p-3 border border-gray-300 rounded-lg w-full"
              />
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-4 text-gray-700">Sub-Departments</h2>
              <div className="space-y-4">
                {subDepartments.map((subDept) => (
                  <div key={subDept._id} className="bg-gray-100 p-4 rounded-lg shadow flex justify-between items-center">
                    <span>{subDept.name}</span>
                    <button
                      className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                      onClick={() => handleRemoveSubDepartment(subDept._id)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <div className="flex">
                  <input
                    type="text"
                    placeholder="New Sub-Department Name"
                    value={newSubDepartment}
                    onChange={(e) => setNewSubDepartment(e.target.value)}
                    className="p-3 border border-gray-300 rounded-lg flex-1"
                  />
                  <button
                    className="bg-green-500 text-white p-3 rounded-lg ml-3 hover:bg-green-600"
                    onClick={handleAddSubDepartment}
                  >
                    Add Sub-Department
                  </button>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-4 text-gray-700">Members</h2>
              <ul className="list-disc list-inside text-gray-600">
                {members.map((member) => (
                  <li key={member._id}>
                    <strong>{member.name}</strong> - {member.position} - {member.skills.join(', ')} - {member.role} - {member.email}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-4 text-gray-700">Add Member to Department</h2>
              <div className="flex items-center space-x-3">
                <select
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className="p-3 border border-gray-300 rounded-lg flex-1"
                >
                  <option value="">Select a user to add</option>
                  {allUsers.map(user => (
                    <option key={user._id} value={user._id}>
                      {user.name} - {user.position} - {user.department ? user.department.name : 'No Department'}
                    </option>
                  ))}
                </select>
                <button
                  className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600"
                  onClick={handleAddMember}
                >
                  Add Member
                </button>
              </div>
            </div>

            <button
              className="bg-blue-500 text-white p-3 rounded-lg w-full hover:bg-blue-600"
              onClick={handleSaveChanges}
            >
              Save Changes
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default EditDepartment;
