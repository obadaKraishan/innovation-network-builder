import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import api from '../utils/api';
import Sidebar from './Sidebar';
import { Link } from 'react-router-dom';

const ManageDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newDepartment, setNewDepartment] = useState({ name: '', parent: null });

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const { data } = await api.get('/departments/full'); // Use the new route to fetch the full hierarchy
      setDepartments(data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleAddDepartment = async () => {
    try {
      await api.post('/departments', newDepartment);
      setNewDepartment({ name: '', parent: null });
      fetchDepartments();
    } catch (error) {
      console.error('Error adding department:', error);
    }
  };

  const handleEditDepartment = async (id, updatedDepartment) => {
    try {
      await api.put(`/departments/${id}`, updatedDepartment);
      fetchDepartments();
    } catch (error) {
      console.error('Error editing department:', error);
    }
  };

  const handleDeleteDepartment = async (id) => {
    try {
      await api.delete(`/departments/${id}`);
      fetchDepartments();
    } catch (error) {
      console.error('Error deleting department:', error);
    }
  };

  const filteredDepartments = departments.filter((dept) =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Manage Departments</h1>
        
        <div className="flex items-center mb-6">
          <input
            type="text"
            placeholder="Search departments..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="p-3 border border-gray-300 rounded-lg flex-1"
          />
          <FaSearch className="ml-3 text-gray-600" />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Departments</h2>
          <div className="space-y-4">
            {filteredDepartments.map((department) => (
              <div key={department._id} className="bg-gray-100 p-4 rounded-lg shadow flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-gray-700">{department.name}</h3>
                  {department.subDepartments?.length > 0 && (
                    <div className="ml-4 mt-2">
                      <h4 className="text-lg font-semibold text-gray-600">Sub-departments:</h4>
                      <ul className="list-disc list-inside text-gray-600">
                        {department.subDepartments.map((subDept) => (
                          <li key={subDept._id}>{subDept.name}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <div className="flex space-x-3">
                  <Link to={`/edit-department/${department._id}`}>
                    <button className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                      <FaEdit /> View/Edit
                    </button>
                  </Link>
                  <button
                    className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                    onClick={() => handleDeleteDepartment(department._id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Add New Department</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Department Name"
                value={newDepartment.name}
                onChange={(e) => setNewDepartment({ ...newDepartment, name: e.target.value })}
                className="p-3 border border-gray-300 rounded-lg w-full"
              />
              <button
                onClick={handleAddDepartment}
                className="bg-green-500 text-white p-3 rounded-lg w-full hover:bg-green-600"
              >
                <FaPlus className="inline mr-2" /> Add Department
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageDepartments;
