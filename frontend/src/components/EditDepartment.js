import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Sidebar from './Sidebar';
import { FaEdit, FaTrashAlt, FaPlusCircle, FaTasks, FaUserTie } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  const [selectedSubDepartment, setSelectedSubDepartment] = useState('');

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
      toast.error('Error fetching department details.');
    }
  };

  const fetchMembers = async (departmentId) => {
    try {
      const { data } = await api.get(`/users/department-users?department=${departmentId}`);
      setMembers(data);
    } catch (error) {
      console.error('Error fetching department members:', error);
      toast.error('Error fetching department members.');
    }
  };

  const fetchAllUsers = async () => {
    try {
      const { data } = await api.get('/users');
      setAllUsers(data);
    } catch (error) {
      console.error('Error fetching all users:', error);
      toast.error('Error fetching all users.');
    }
  };

  const handleSaveChanges = async () => {
    try {
      await api.put(`/departments/${id}`, { name: departmentName });
      toast.success('Department name updated successfully.');
      navigate('/manage-departments');
    } catch (error) {
      console.error('Error saving department changes:', error);
      toast.error('Error saving department changes.');
    }
  };

  const handleAddSubDepartment = async () => {
    try {
      const { data } = await api.post('/departments', { name: newSubDepartment, parent: id });
      setSubDepartments([...subDepartments, data]);
      setNewSubDepartment('');
      toast.success('Sub-department added successfully.');
    } catch (error) {
      console.error('Error adding sub-department:', error);
      toast.error('Error adding sub-department.');
    }
  };

  const handleRemoveSubDepartment = async (subDeptId) => {
    try {
      await api.delete(`/departments/${subDeptId}`);
      setSubDepartments(subDepartments.filter((subDept) => subDept._id !== subDeptId));
      toast.success('Sub-department removed successfully.');
    } catch (error) {
      console.error('Error removing sub-department:', error);
      toast.error('Error removing sub-department.');
    }
  };

  const handleAddMember = async () => {
    try {
        const user = allUsers.find(user => user._id === selectedUser);
        if (user && selectedSubDepartment) {
            // Update the user's department instead of creating a new user
            const updatedUser = await api.put(`/users/${selectedUser}`, { department: selectedSubDepartment });

            // Update the members list by finding and replacing the updated user
            const updatedMembers = members.map(member => 
                member._id === updatedUser.data._id ? { ...member, department: selectedSubDepartment } : member
            );

            setMembers(updatedMembers);
            setSelectedUser('');
            setSelectedSubDepartment('');
            toast.success('Member updated successfully in the department.');
        } else {
            toast.error('Please select both a user and a sub-department.');
        }
    } catch (error) {
        console.error('Error updating member in department:', error);
        toast.error('Error updating member in the department.');
    }
};

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100 overflow-y-auto">
        <ToastContainer />

        <h1 className="text-3xl font-bold mb-6 text-gray-800">Edit Department</h1>

        {department && (
          <>
            <div className="mb-6">
              <label className="block text-lg font-semibold text-gray-700">Department Name:</label>
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  value={departmentName}
                  onChange={(e) => setDepartmentName(e.target.value)}
                  className="p-3 border border-gray-300 rounded-lg w-full"
                />
                <button
                  className="bg-blue-500 text-white p-3 rounded-lg flex items-center hover:bg-blue-600"
                  onClick={handleSaveChanges}
                >
                  <FaEdit className="mr-2" />
                  Save
                </button>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-4 text-gray-700 flex items-center">
                <FaTasks className="mr-2" /> Sub-Departments
              </h2>
              <div className="space-y-4">
                {subDepartments.map((subDept) => (
                  <div
                    key={subDept._id}
                    className="bg-white p-4 rounded-lg shadow flex justify-between items-center border border-gray-300"
                  >
                    <span className="font-medium text-gray-800">{subDept.name}</span>
                    <button
                      className="bg-red-500 text-white p-2 rounded hover:bg-red-600 flex items-center"
                      onClick={() => handleRemoveSubDepartment(subDept._id)}
                    >
                      <FaTrashAlt className="mr-1" />
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
                    className="bg-green-500 text-white p-3 rounded-lg ml-3 hover:bg-green-600 flex items-center"
                    onClick={handleAddSubDepartment}
                  >
                    <FaPlusCircle className="mr-2" />
                    Add
                  </button>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-4 text-gray-700 flex items-center">
                <FaUserTie className="mr-2" /> Members
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {members.map((member) => (
                  <div
                    key={member._id}
                    className="bg-white p-4 rounded-lg shadow border border-gray-300 flex flex-col justify-between"
                  >
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 mb-2">{member.name}</h3>
                      <p className="text-sm text-gray-600 mb-1">
                        <strong>Position:</strong> {member.position}
                      </p>
                      <p className="text-sm text-gray-600 mb-1">
                        <strong>Skills:</strong> {member.skills.join(', ')}
                      </p>
                      <p className="text-sm text-gray-600 mb-1">
                        <strong>Role:</strong> {member.role}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Email:</strong> {member.email}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-4 text-gray-700 flex items-center">
                <FaPlusCircle className="mr-2" /> Add Member to Department
              </h2>
              <div className="flex flex-col space-y-3">
                <select
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className="p-3 border border-gray-300 rounded-lg"
                >
                  <option value="">Select a user to add</option>
                  {allUsers.map(user => (
                    <option key={user._id} value={user._id}>
                      {user.name} - {user.position} - {user.department ? user.department.name : 'No Department'}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedSubDepartment}
                  onChange={(e) => setSelectedSubDepartment(e.target.value)}
                  className="p-3 border border-gray-300 rounded-lg"
                  disabled={!selectedUser}
                >
                  <option value="">Select a sub-department</option>
                  {subDepartments.map(subDept => (
                    <option key={subDept._id} value={subDept._id}>
                      {subDept.name}
                    </option>
                  ))}
                </select>

                <button
                  className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 flex items-center"
                  onClick={handleAddMember}
                >
                  <FaPlusCircle className="mr-2" />
                  Add Member
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EditDepartment;
