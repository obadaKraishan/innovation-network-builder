import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-toastify';

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
    <div className="flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Resource</h1>
      <input
        type="text"
        placeholder="Resource Title"
        value={resource.title}
        onChange={(e) => setResource({ ...resource, title: e.target.value })}
        className="mb-2 p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Resource Category"
        value={resource.category}
        onChange={(e) => setResource({ ...resource, category: e.target.value })}
        className="mb-2 p-2 border rounded"
      />
      <input
        type="url"
        placeholder="Resource URL"
        value={resource.url}
        onChange={(e) => setResource({ ...resource, url: e.target.value })}
        className="mb-2 p-2 border rounded"
      />
      <button onClick={handleUpdateResource} className="bg-blue-500 text-white px-4 py-2 rounded">
        Update Resource
      </button>
    </div>
  );
};

export default WellnessEditResource;
