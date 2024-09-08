import React, { useEffect, useState, useContext } from 'react';
import Sidebar from './Sidebar'; 
import api from '../utils/api';
import AuthContext from '../context/AuthContext';
import { toast } from 'react-toastify';

const WellnessResources = () => {
  const { user } = useContext(AuthContext);
  const [resources, setResources] = useState([]);
  const [newResource, setNewResource] = useState({ title: '', category: '', url: '' });

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
    } catch (error) {
      toast.error('Failed to add resource');
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100 overflow-y-auto">
        <div className="p-6 bg-white shadow rounded-lg">
          <h1 className="text-2xl font-bold mb-4">Wellness Resources</h1>

          {/* Admin can add new resources */}
          {['CEO', 'Manager'].includes(user.role) && (
            <div className="mb-6">
              <h2 className="text-xl">Add New Resource</h2>
              <input type="text" placeholder="Resource Title" value={newResource.title} onChange={(e) => setNewResource({ ...newResource, title: e.target.value })} />
              <input type="text" placeholder="Resource Category" value={newResource.category} onChange={(e) => setNewResource({ ...newResource, category: e.target.value })} />
              <input type="url" placeholder="Resource URL" value={newResource.url} onChange={(e) => setNewResource({ ...newResource, url: e.target.value })} />
              <button onClick={handleAddResource}>Add Resource</button>
            </div>
          )}

          <div>
            <ul className="space-y-4">
              {resources.map((resource) => (
                <li key={resource._id} className="p-4 bg-gray-100 shadow rounded-lg">
                  <h2 className="text-xl font-bold">{resource.resourceTitle}</h2>
                  <p>{resource.resourceCategory}</p>
                  <a href={resource.resourceURL} className="text-blue-500 hover:underline">View Resource</a>
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
