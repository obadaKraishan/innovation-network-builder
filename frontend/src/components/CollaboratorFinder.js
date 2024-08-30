import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';

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
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 bg-gray-100 overflow-y-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Find Collaborators</h1>
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <form onSubmit={handleSearch}>
            <div className="mb-6">
              <label className="block text-gray-700 mb-2 font-semibold">Department</label>
              <select
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <div className="mb-6">
              <label className="block text-gray-700 mb-2 font-semibold">Skills (hold Ctrl/Cmd to select multiple)</label>
              <select
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={skills}
                onChange={handleSkillChange}
                multiple
                style={{ height: '200px' }}
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
              className="w-full bg-blue-500 text-white p-3 rounded-lg font-semibold hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-700"
            >
              Search
            </button>
          </form>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((user) => (
              <div key={user._id} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{user.name}</h3>
                <p className="text-gray-700"><strong>Position:</strong> {user.position}</p>
                <p className="text-gray-700"><strong>Role:</strong> {user.role}</p>
                <p className="text-gray-700"><strong>Department:</strong> {user.department?.name}</p>
                <p className="text-gray-700"><strong>Email:</strong> <a href={`mailto:${user.email}`} className="text-blue-500 underline">{user.email}</a></p>
                <div className="mt-4">
                  <strong className="text-gray-800">Skills:</strong>
                  <div className="border border-gray-300 rounded p-4 bg-gray-50 mt-2">
                    {user.skills.join(', ')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CollaboratorFinder;
