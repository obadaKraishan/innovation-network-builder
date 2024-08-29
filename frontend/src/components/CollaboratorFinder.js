import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CollaboratorFinder = () => {
  const [department, setDepartment] = useState('');
  const [skills, setSkills] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.get('http://localhost:5001/api/users/search', {
        params: {
          department,
          skills,
        },
      });

      setResults(data);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Find Collaborators</h1>
      <form onSubmit={handleSearch} className="mb-4">
        <div className="mb-4">
          <label>Department</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label>Skills (comma-separated)</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
          />
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
