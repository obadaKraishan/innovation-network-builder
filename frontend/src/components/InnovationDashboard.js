// File: frontend/src/components/InnovationDashboard.js
import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaArrowRight, FaPlus } from 'react-icons/fa';
import api from '../utils/api';
import Select from 'react-select';

const InnovationDashboard = () => {
  const [ideas, setIdeas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('');
  const [loading, setLoading] = useState(true); // New state for loading
  const [error, setError] = useState(null); // New state for errors
  const navigate = useNavigate();

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const { data } = await api.get('/innovation/ideas');
        setIdeas(data);
        setLoading(false); // Stop loading after the request is successful
      } catch (error) {
        setError('Failed to fetch ideas');
        setLoading(false); // Stop loading after the request fails
      }
    };
    fetchIdeas();
  }, []);

  const filteredIdeas = ideas
    .filter(idea =>
      idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idea.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(idea => !stageFilter || idea.stage === stageFilter);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Innovation Dashboard</h1>
          <button
            onClick={() => navigate('/submit-idea')}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <FaPlus className="mr-2" /> Submit Idea
          </button>
        </div>

        {/* Search Input */}
        <div className="mb-6">
          <div className="flex items-center">
            <FaSearch className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search ideas..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        {/* Stage Filter */}
        <div className="mb-6">
          <Select
            placeholder="Filter by Stage"
            options={[
              { value: 'submission', label: 'Submission' },
              { value: 'review', label: 'Review' },
              { value: 'development', label: 'Development' },
              { value: 'implementation', label: 'Implementation' },
            ]}
            onChange={option => setStageFilter(option ? option.value : '')}
            isClearable
            className="w-full"
          />
        </div>

        {/* Loading, Error, and Empty States */}
        {loading ? (
          <div className="text-center text-gray-500">Loading ideas...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : filteredIdeas.length === 0 ? (
          <div className="text-center text-gray-500">No ideas available.</div>
        ) : (
          <table className="min-w-full bg-white shadow-lg rounded-lg">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Title</th>
                <th className="py-2 px-4 border-b">Stage</th>
                <th className="py-2 px-4 border-b">Department</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredIdeas.map(idea => (
                <tr key={idea._id}>
                  <td className="py-2 px-4 border-b">{idea.title}</td>
                  <td className="py-2 px-4 border-b">{idea.stage}</td>
                  <td className="py-2 px-4 border-b">{idea.department?.name || 'N/A'}</td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => navigate(`/innovation/idea/${idea._id}`)}
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default InnovationDashboard;
