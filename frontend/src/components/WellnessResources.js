import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar'; // Import Sidebar
import api from '../utils/api';
import { toast } from 'react-toastify';

const WellnessResources = () => {
  const [resources, setResources] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

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

  const filteredResources = resources.filter((resource) =>
    (resource.title.toLowerCase().includes(searchTerm.toLowerCase()) || resource.category.includes(searchTerm)) &&
    (!selectedCategory || resource.category === selectedCategory)
  );

  return (
    <div className="flex h-screen">
      <Sidebar /> {/* Add Sidebar */}
      <div className="flex-1 p-6 bg-gray-100 overflow-y-auto">
        <div className="p-6 bg-white shadow rounded-lg">
          <h1 className="text-2xl font-bold mb-4">Wellness Resources</h1>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search by keyword"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Filter by Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded"
            >
              <option value="">All Categories</option>
              <option value="Mental Health">Mental Health</option>
              <option value="Fitness">Fitness</option>
              <option value="Work-Life Balance">Work-Life Balance</option>
            </select>
          </div>
          <div>
            <ul className="space-y-4">
              {filteredResources.map((resource) => (
                <li key={resource._id} className="p-4 bg-gray-100 shadow rounded-lg">
                  <h2 className="text-xl font-bold">{resource.title}</h2>
                  <p>{resource.category}</p>
                  <a href={resource.url} className="text-blue-500 hover:underline">
                    View Resource
                  </a>
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
