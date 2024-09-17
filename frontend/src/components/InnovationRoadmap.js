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
        console.log("Fetched ideas: ", data); // Log the data to inspect it
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

  // New utility function to ensure valid dates
  const ensureValidDate = (date, fallback) => {
    let parsedDate = new Date(date);
    if (!date || isNaN(parsedDate.getTime())) {
      console.warn(`Invalid date: ${date}, using fallback: ${fallback}`);
      return fallback;
    }
    return parsedDate;
  };

  // Ensure that start and end dates are valid before passing to Gantt
  const formatIdeasForGantt = () => {
    return filteredIdeas.map(idea => {
      // Debugging logs to capture invalid data
      console.log(`Raw idea data for "${idea.title}":`, idea);
      
      let startDate = ensureValidDate(idea.startDate, new Date());
      let endDate = ensureValidDate(idea.endDate, new Date());

      // Ensure startDate is before or equal to endDate
      if (startDate > endDate) {
        console.warn(`Start date (${startDate}) is after end date (${endDate}) for idea "${idea.title}". Adjusting end date.`);
        endDate = new Date(startDate); // Adjust end date to start date
      }

      // Final check before creating the Gantt task
      console.log(`Formatted for Gantt: ${idea.title} starts on ${startDate} and ends on ${endDate}`);

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
                options={ideas.map(idea => ({ value: idea.department?._id, label: idea.department?.name || 'Unknown' }))}
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

          {/* Render Gantt chart only when tasks are valid */}
          {filteredIdeas.length > 0 ? (
            <FrappeGantt tasks={formatIdeasForGantt()} />
          ) : (
            <p>No ideas available to display in the roadmap.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default InnovationRoadmap;
