import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import api from '../utils/api';
import Sidebar from './Sidebar';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2'; // Import SweetAlert2

const ManageDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newDepartment, setNewDepartment] = useState({ name: '', parent: null });

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const { data } = await api.get('/departments/full');
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
      const [name, parentName] = newDepartment.name.split(',').map(str => str.trim());
      let parentId = null;

      if (parentName) {
        const parentDepartment = departments.find(dept => dept.name === parentName);
        if (parentDepartment) {
          parentId = parentDepartment._id;
        } else {
          console.error('Parent department not found');
          return;
        }
      }

      if (parentId) {
        await api.post('/departments/sub', { name, parent: parentId });
      } else {
        await api.post('/departments/parent', { name });
      }

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

  const handleDeleteDepartment = async (id, departmentName) => {
    try {
      const result = await Swal.fire({
        title: `Are you sure you want to delete the department "${departmentName}"?`,
        text: "This action cannot be undone!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!',
      });

      if (result.isConfirmed) {
        await api.delete(`/departments/${id}`);
        toast.success(`Department "${departmentName}" deleted successfully.`);
        fetchDepartments();
      }
    } catch (error) {
      console.error('Error deleting department:', error);
      toast.error('Failed to delete department. Please try again.');
    }
  };

  const filteredDepartments = departments.filter((dept) =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100 overflow-y-auto">
        <ToastContainer />
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
                    onClick={() => handleDeleteDepartment(department._id, department.name)}
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
                placeholder="Department Name, Parent Department Name (optional)"
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
