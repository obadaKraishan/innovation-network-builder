import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-toastify';
import Sidebar from './Sidebar'; // Import Sidebar

const WellnessEditResource = () => {
  const { resourceId } = useParams();
  const [resource, setResource] = useState({ title: '', category: '', url: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResource = async () => {
      try {
        const { data } = await api.get(`/wellness/resources/${resourceId}`);
        setResource({
          title: data.resourceTitle,
          category: data.resourceCategory,
          url: data.resourceURL,
        });
      } catch (error) {
        toast.error('Failed to fetch resource details');
      }
    };

    fetchResource();
  }, [resourceId]);

  const handleUpdateResource = async () => {
    try {
      await api.put(`/wellness/resources/${resourceId}`, resource);
      toast.success('Resource updated successfully');
      navigate('/wellness/dashboard');
    } catch (error) {
      toast.error('Failed to update resource');
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar /> {/* Sidebar added */}
      <div className="flex-1 p-6 bg-gray-100 overflow-y-auto">
        <div className="p-6 bg-white shadow rounded-lg">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mb-6"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
          <h1 className="text-3xl font-bold mb-6">Edit Resource</h1>

          {/* Form */}
          <form className="space-y-6">
            <div>
              <label className="block text-lg text-gray-700 font-medium mb-2">Resource Title</label>
              <input
                type="text"
                placeholder="Resource Title"
                value={resource.title}
                onChange={(e) => setResource({ ...resource, title: e.target.value })}
                className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-lg text-gray-700 font-medium mb-2">Resource Category</label>
              <input
                type="text"
                placeholder="Resource Category"
                value={resource.category}
                onChange={(e) => setResource({ ...resource, category: e.target.value })}
                className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-lg text-gray-700 font-medium mb-2">Resource URL</label>
              <input
                type="url"
                placeholder="Resource URL"
                value={resource.url}
                onChange={(e) => setResource({ ...resource, url: e.target.value })}
                className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              onClick={handleUpdateResource}
              className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-200"
            >
              Update Resource
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WellnessEditResource;
