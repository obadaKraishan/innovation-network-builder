// File: frontend/src/components/Sidebar.js

import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);

  if (!user) {
    return null;
  }

  const links = {
    Employee: ['Profile', 'My Team', 'Collaborator Finder'],
    'Department Manager': ['Profile', 'Manage Team', 'Reports', 'Collaborator Finder'],
    Executive: ['Profile', 'Overview', 'Company Reports', 'Manage Departments', 'Collaborator Finder'],
  };

  return (
    <aside className="w-1/4 bg-gray-800 text-white p-6 h-full flex flex-col justify-between">
      <div>
        <h2 className="text-xl mb-4">Dashboard</h2>
        <ul>
          <li className="mb-2">
            <Link to="/dashboard" className="hover:text-blue-400">
              Dashboard
            </Link>
          </li>
          {links[user.role]?.map((link, index) => (
            <li key={index} className="mb-2">
              <Link
                to={
                  link === 'Profile'
                    ? '/profile'
                    : link === 'Collaborator Finder'
                    ? '/collaborator-finder'
                    : '#'
                }
                className="hover:text-blue-400"
              >
                {link}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <button
        onClick={logout}
        className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-700 mt-auto"
      >
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;
