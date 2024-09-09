import React, { useEffect, useState, useContext } from 'react';
import Sidebar from './Sidebar';
import api from '../utils/api';
import AuthContext from '../context/AuthContext';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { FaEdit, FaTrashAlt, FaPlusSquare } from 'react-icons/fa';
import Modal from 'react-modal'; // Modal for adding a new resource
import { useNavigate } from 'react-router-dom';

// Make sure to set up Modal's root element
Modal.setAppElement('#root');

const WellnessResources = () => {
  const { user } = useContext(AuthContext);
  const [resources, setResources] = useState([]);
  const [newResource, setNewResource] = useState({ title: '', category: '', url: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const { data } = await api.get('/wellness/resources');
        setResources(data);
      } catch (error) {
        toast.error('Failed to fetch resources');
      }
    };
    fetchResources();
  }, []);

  const handleAddResource = async () => {
    try {
      const { data } = await api.post('/wellness/resources', newResource);
      setResources([...resources, data]);
      toast.success('Resource added successfully');
      setIsModalOpen(false); // Close modal after adding
    } catch (error) {
      toast.error('Failed to add resource');
    }
  };

  const handleDeleteResource = async (resourceId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this resource?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/wellness/resources/${resourceId}`);
        setResources(resources.filter((resource) => resource._id !== resourceId));
        toast.success('Resource deleted successfully');
      } catch (error) {
        toast.error('Failed to delete resource');
      }
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100 overflow-y-auto">
        <div className="p-6 bg-white shadow rounded-lg">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mb-6"
            onClick={() => navigate(-1)} // Back button functionality
          >
            Back
          </button>
          <h1 className="text-2xl font-bold mb-4">Wellness Resources</h1>

          {/* Admin can add new resources */}
          {['CEO', 'Manager'].includes(user.role) && (
            <>
              <button
                className="bg-green-500 text-white p-2 rounded-lg flex items-center mb-4"
                onClick={() => setIsModalOpen(true)} // Open modal for new resource
              >
                <FaPlusSquare className="mr-2" /> Add New Resource
              </button>

              <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                contentLabel="Add Resource"
                className="modal bg-white p-6 rounded shadow-lg max-w-lg mx-auto"
                overlayClassName="modal-overlay"
              >
                <h2 className="text-xl font-bold mb-4">Add New Resource</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Resource Title</label>
                    <input
                      type="text"
                      placeholder="Resource Title"
                      value={newResource.title}
                      onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Resource Category</label>
                    <input
                      type="text"
                      placeholder="Resource Category"
                      value={newResource.category}
                      onChange={(e) => setNewResource({ ...newResource, category: e.target.value })}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Resource URL</label>
                    <input
                      type="url"
                      placeholder="Resource URL"
                      value={newResource.url}
                      onChange={(e) => setNewResource({ ...newResource, url: e.target.value })}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <button
                    className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
                    onClick={handleAddResource}
                  >
                    Add Resource
                  </button>
                </div>
              </Modal>
            </>
          )}

          <div>
            <ul className="space-y-4">
              {resources.map((resource) => (
                <li key={resource._id} className="p-4 bg-gray-100 shadow rounded-lg flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold">{resource.resourceTitle || 'Unknown Title'}</h2>
                    <p>Category: {resource.resourceCategory || 'Unknown Category'}</p>
                    <p>Created By: {resource.createdBy?.name || 'Unknown'}</p>
                    <p>Created On: {new Date(resource.createdAt).toLocaleDateString()}</p>
                    <a href={resource.resourceURL} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
                      Visit Resource
                    </a>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      className="text-blue-500 flex items-center"
                      onClick={() => navigate(`/wellness/edit-resource/${resource._id}`)}
                    >
                      <FaEdit className="mr-2" /> Edit
                    </button>
                    <button
                      className="text-red-500 flex items-center"
                      onClick={() => handleDeleteResource(resource._id)}
                    >
                      <FaTrashAlt className="mr-2" /> Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WellnessResources;
