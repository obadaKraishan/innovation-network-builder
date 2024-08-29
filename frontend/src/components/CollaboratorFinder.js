import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CollaboratorFinder = () => {
  const [department, setDepartment] = useState('');
  const [skills, setSkills] = useState([]);  // Updated to an array for multiple select
  const [departments, setDepartments] = useState([]);  // State for departments
  const [allSkills, setAllSkills] = useState([]);  // State for all available skills
  const [results, setResults] = useState([]);

  useEffect(() => {
    // Fetch departments and skills when component mounts
    const fetchDepartments = async () => {
      try {
        const { data } = await axios.get('http://localhost:5001/api/departments', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Add token to headers
          },
        });
        setDepartments(data);
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };

    const fetchSkills = async () => {
      try {
        const { data } = await axios.get('http://localhost:5001/api/users/skills', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Add token to headers
          },
        });
        setAllSkills(data);
      } catch (error) {
        console.error('Error fetching skills:', error);
      }
    };

    fetchDepartments();
    fetchSkills();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.get('http://localhost:5001/api/users/search', {
        params: {
          department,
          skills: skills.join(','),  // Join array into a string for query params
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Add token to headers
        },
      });

      setResults(data);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  const handleSkillChange = (e) => {
    const value = Array.from(e.target.selectedOptions, option => option.value);
    setSkills(value);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Find Collaborators</h1>
      <form onSubmit={handleSearch} className="mb-4">
        <div className="mb-4">
          <label>Department</label>
          <select
            className="w-full p-2 border border-gray-300 rounded"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          >
            <option value="">Select a department</option>
            {departments.map((dept) => (
              <option key={dept._id} value={dept._id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label>Skills (hold Ctrl/Cmd to select multiple)</label>
          <select
            className="w-full p-2 border border-gray-300 rounded"
            value={skills}
            onChange={handleSkillChange}
            multiple
          >
            {allSkills.map((skill, index) => (
              <option key={index} value={skill}>
                {skill}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
        >
          Search
        </button>
      </form>
      <div>
        <h2 className="text-xl mb-4">Results</h2>
        <ul>
          {results.map((user) => (
            <li key={user._id} className="mb-2">
              {user.name} - {user.role} ({user.skills.join(', ')})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CollaboratorFinder;
