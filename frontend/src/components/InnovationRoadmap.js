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

  // Utility function to ensure valid dates or return a fallback
  const ensureValidDate = (date, ideaTitle) => {
    if (!date) {
      console.warn(`Date is missing for "${ideaTitle}". Using fallback date.`);
      return new Date(); // Return current date as fallback
    }
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      console.warn(`Invalid date for "${ideaTitle}": ${date}. Using fallback date.`);
      return new Date(); // Return current date as fallback
    }
    return parsedDate; // Return parsed date if valid
  };

  // Format ideas for Gantt chart, skipping those with invalid dates
  const formatIdeasForGantt = () => {
    return filteredIdeas
      .map(idea => {
        // Log the raw idea data
        console.log(`Raw idea data for "${idea.title}":`, idea);

        // Ensure valid dates
        const startDate = ensureValidDate(idea.startDate, idea.title);
        const endDate = ensureValidDate(idea.endDate, idea.title);

        // Ensure startDate is before or equal to endDate
        if (startDate > endDate) {
          console.warn(`Start date (${startDate}) is after end date (${endDate}) for idea "${idea.title}". Adjusting end date.`);
          endDate.setTime(startDate.getTime()); // Adjust end date to match start date
        }

        console.log(`Formatted for Gantt: ${idea.title} starts on ${startDate} and ends on ${endDate}`);

        return {
          id: idea._id,
          name: idea.title,
          start: startDate,
          end: endDate,
          progress: idea.progress || 0,
          dependencies: idea.dependencies || ''
        };
      })
      .filter(idea => idea !== null);  // Remove any null values from invalid ideas
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
