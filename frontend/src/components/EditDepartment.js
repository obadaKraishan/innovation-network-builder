import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Sidebar from './Sidebar';
import { FaArrowLeft, FaEdit, FaTrashAlt, FaPlusCircle, FaTasks, FaUserTie } from 'react-icons/fa'; // Import FaArrowLeft for the back button
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditDepartment = () => {
  const { id } = useParams(); // Get the department ID from the URL
  const navigate = useNavigate();

  const [department, setDepartment] = useState(null); // State to hold the department details
  const [departmentName, setDepartmentName] = useState(''); // State to hold the department name
  const [subDepartments, setSubDepartments] = useState([]); // State to hold sub-departments
  const [newSubDepartment, setNewSubDepartment] = useState(''); // State to hold the new sub-department name
  const [members, setMembers] = useState([]); // State to hold the department members
  const [allUsers, setAllUsers] = useState([]); // State to hold all users
  const [selectedUser, setSelectedUser] = useState(''); // State to hold the selected user for adding to a sub-department
  const [selectedSubDepartment, setSelectedSubDepartment] = useState(''); // State to hold the selected sub-department

  // Fetch the department and its related members and sub-departments on mount
  useEffect(() => {
    fetchDepartment();
    fetchAllUsers();
  }, [id]);

  // Fetch the department details by ID
  const fetchDepartment = async () => {
    try {
      const { data } = await api.get(`/departments/${id}`);
      setDepartment(data);
      setDepartmentName(data.name);
      setSubDepartments(Array.isArray(data.subDepartments) ? data.subDepartments : []);
      setMembers(Array.isArray(data.members) ? data.members : []);
    } catch (error) {
      console.error('Error fetching department:', error); // Log the error
      toast.error('Error fetching department details.'); // Show error toast
    }
  };

  // Fetch all users in the system
  const fetchAllUsers = async () => {
    try {
      const { data } = await api.get('/users');
      setAllUsers(data);
    } catch (error) {
      console.error('Error fetching all users:', error); // Log the error
      toast.error('Error fetching all users.'); // Show error toast
    }
  };

  // Save changes made to the department name
  const handleSaveChanges = async () => {
    try {
      await api.put(`/departments/${id}`, { name: departmentName });
      toast.success('Department name updated successfully.'); // Show success toast
      navigate('/manage-departments'); // Redirect to manage departments page
    } catch (error) {
      console.error('Error saving department changes:', error); // Log the error
      toast.error('Error saving department changes.'); // Show error toast
    }
  };

  // Add a new sub-department to the current department
  const handleAddSubDepartment = async () => {
    try {
      const { data } = await api.post('/departments/sub', { name: newSubDepartment, parent: id });
      setSubDepartments([...subDepartments, data]); // Update the sub-departments state
      setNewSubDepartment(''); // Clear the input field
      toast.success('Sub-department added successfully.'); // Show success toast
    } catch (error) {
      console.error('Error adding sub-department:', error); // Log the error
      toast.error('Error adding sub-department.'); // Show error toast
    }
  };

  // Remove a sub-department from the current department
  const handleRemoveSubDepartment = async (subDeptId) => {
    try {
      await api.delete(`/departments/${subDeptId}`);
      setSubDepartments(subDepartments.filter((subDept) => subDept._id !== subDeptId)); // Update the sub-departments state
      toast.success('Sub-department removed successfully.'); // Show success toast
    } catch (error) {
      console.error('Error removing sub-department:', error); // Log the error
      toast.error('Error removing sub-department.'); // Show error toast
    }
  };

  // Add a member to a sub-department
  const handleAddMember = async () => {
    try {
      const user = allUsers.find(user => user._id === selectedUser); // Find the selected user
      if (user && selectedSubDepartment) {
        // Update the user's department instead of creating a new user
        const updatedUser = await api.put(`/users/${selectedUser}`, { department: selectedSubDepartment });

        // Update the members list by finding and replacing the updated user
        const updatedMembers = members.map(member =>
          member._id === updatedUser.data._id ? { ...member, department: selectedSubDepartment } : member
        );

        setMembers(updatedMembers); // Update the members state
        setSelectedUser(''); // Clear the selected user
        setSelectedSubDepartment(''); // Clear the selected sub-department
        toast.success('Member updated successfully in the department.'); // Show success toast
    } else {
        toast.error('Please select both a user and a sub-department.'); // Show error toast
      }
    } catch (error) {
      console.error('Error updating member in department:', error); // Log the error
      toast.error('Error updating member in the department.'); // Show error toast
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100 overflow-y-auto">
        <ToastContainer />

        <button
          className="flex items-center text-blue-500 hover:text-blue-700 mb-6"
          onClick={() => navigate('/manage-departments')}
        >
          <FaArrowLeft className="mr-2" /> Back to Manage Departments
        </button>

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
                {subDepartments.length > 0 ? (
                  subDepartments.map((subDept) => (
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
                  ))
                ) : (
                  <p className="text-gray-600">No sub-departments found. Add a new one below.</p>
                )}
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
                {members.length > 0 ? (
                  members.map((member) => (
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
                  ))
                ) : (
                  <p className="text-gray-600">No members found. Add members below.</p>
                )}
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
