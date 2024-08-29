import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CollaboratorFinder = () => {
  const [department, setDepartment] = useState('');
  const [skills, setSkills] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [allSkills, setAllSkills] = useState([]);
  const [filteredSkills, setFilteredSkills] = useState([]);
  const [results, setResults] = useState([]);

  useEffect(() => {
    // Fetch departments when the component mounts
    const fetchDepartments = async () => {
      try {
        const { data } = await axios.get('http://localhost:5001/api/departments', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setDepartments(data);
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };

    fetchDepartments();
  }, []);

  useEffect(() => {
    // Fetch all skills when the component mounts
    const fetchSkills = async () => {
      try {
        const { data } = await axios.get('http://localhost:5001/api/users/skills', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setAllSkills(data);
      } catch (error) {
        console.error('Error fetching skills:', error);
      }
    };

    fetchSkills();
  }, []);

  useEffect(() => {
    // Filter skills based on the selected department
    if (department) {
      const fetchUsersByDepartment = async () => {
        try {
          const { data } = await axios.get('http://localhost:5001/api/users/search', {
            params: { department },
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          const departmentSkills = Array.from(new Set(data.flatMap(user => user.skills)));
          setFilteredSkills(departmentSkills);
        } catch (error) {
          console.error('Error fetching users by department:', error);
        }
      };

      fetchUsersByDepartment();
    } else {
      setFilteredSkills(allSkills); // Reset to all skills if no department is selected
    }
  }, [department, allSkills]);

  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.get('http://localhost:5001/api/users/search', {
        params: {
          department,
          skills: skills.join(','),
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
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
            style={{ height: '200px' }} // Increased height for better visibility
          >
            {filteredSkills.map((skill, index) => (
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((user) => (
            <div key={user._id} className="border rounded-lg p-4 shadow-md">
              <h3 className="text-lg font-semibold">{user.name}</h3>
              <p><strong>Position:</strong> {user.position}</p>
              <p><strong>Role:</strong> {user.role}</p>
              <p><strong>Department:</strong> {user.department?.name}</p>
              <p><strong>Email:</strong> <a href={`mailto:${user.email}`} className="text-blue-500">{user.email}</a></p>
              <div className="mt-2">
                <strong>Skills:</strong>
                <div className="border border-gray-300 rounded p-2 mt-1" style={{ minHeight: '150px' }}>
                  {user.skills.join(', ')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CollaboratorFinder;
