import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Select from 'react-select';
import { FrappeGantt } from 'frappe-gantt-react'; // Import Gantt Chart Component

const InnovationRoadmap = () => {
  const [ideas, setIdeas] = useState([]);
  const [filteredIdeas, setFilteredIdeas] = useState([]);
  const [departmentFilter, setDepartmentFilter] = useState(null);
  const [stageFilter, setStageFilter] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const { data } = await api.get('/innovation/ideas');
        setIdeas(data);
        setFilteredIdeas(data);
      } catch (error) {
        console.error('Failed to fetch ideas', error);
      }
    };
    fetchIdeas();
  }, []);

  const handleFilterChange = () => {
    let filtered = ideas;

    if (departmentFilter) {
      filtered = filtered.filter(idea => idea.department?._id === departmentFilter.value);
    }
    if (stageFilter) {
      filtered = filtered.filter(idea => idea.stage === stageFilter.value);
    }

    setFilteredIdeas(filtered);
  };

  useEffect(() => {
    handleFilterChange();
  }, [departmentFilter, stageFilter]);

  // Ensure that start and end dates are valid before passing to Gantt
  const formatIdeasForGantt = () => {
    return filteredIdeas.map(idea => {
      let startDate = idea.startDate ? new Date(idea.startDate) : null;
      let endDate = idea.endDate ? new Date(idea.endDate) : null;
  
      // Validate start date
      if (!startDate || isNaN(startDate.getTime())) {
        console.warn(`Idea "${idea.title}" has an invalid or missing start date. Using the current date as fallback.`);
        startDate = new Date(); // Fallback to the current date
      }
  
      // Validate end date
      if (!endDate || isNaN(endDate.getTime())) {
        console.warn(`Idea "${idea.title}" has an invalid or missing end date. Using the current date as fallback.`);
        endDate = new Date(); // Fallback to the current date
      }
  
      // Make sure start date is before or equal to end date
      if (startDate > endDate) {
        console.warn(`Idea "${idea.title}" has a start date after the end date. Adjusting the end date to match start date.`);
        endDate = new Date(startDate); // Fallback to start date
      }
  
      return {
        id: idea._id,
        name: idea.title,
        start: startDate,
        end: endDate,
        progress: idea.progress || 0,
        dependencies: idea.dependencies || ''
      };
    });
  };
  
  
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-4">Innovation Roadmap</h1>

          <div className="flex space-x-4 mb-6">
            <div className="w-1/2">
              <Select
                placeholder="Filter by Department"
                options={ideas.map(idea => ({ value: idea.department._id, label: idea.department.name }))}
                onChange={setDepartmentFilter}
                isClearable
              />
            </div>

            <div className="w-1/2">
              <Select
                placeholder="Filter by Stage"
                options={[
                  { value: 'submission', label: 'Submission' },
                  { value: 'review', label: 'Review' },
                  { value: 'development', label: 'Development' },
                  { value: 'implementation', label: 'Implementation' },
                ]}
                onChange={setStageFilter}
                isClearable
              />
            </div>
          </div>

          {/* Ensure all tasks have valid dates */}
          <FrappeGantt tasks={formatIdeasForGantt()} /> {/* Render Gantt chart with filtered ideas */}
        </div>
      </div>
    </div>
  );
};

export default InnovationRoadmap;
