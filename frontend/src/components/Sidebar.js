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
    'Team Leader': ['Profile', 'My Team', 'Team Overview', 'Collaborator Finder'],
    'Department Manager': ['Profile', 'Manage Team', 'Reports', 'Collaborator Finder'],
    'CEO': ['Profile', 'Overview', 'Company Reports', 'Manage Departments', 'Collaborator Finder'],
    'CTO': ['Profile', 'Technology Overview', 'Manage IT', 'Collaborator Finder'],
    'Director of HR': ['Profile', 'HR Overview', 'Manage Recruitment', 'Collaborator Finder'],
    'Director of Finance': ['Profile', 'Finance Overview', 'Budget Reports', 'Collaborator Finder'],
    'Research Scientist': ['Profile', 'Research Projects', 'Collaborator Finder'],
    'Customer Support Specialist': ['Profile', 'Customer Cases', 'Collaborator Finder'],
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
                    : link === 'My Team'
                    ? '/my-team'
                    : link === 'Manage Team'
                    ? '/manage-team'
                    : link === 'Reports'
                    ? '/reports'
                    : link === 'Overview'
                    ? '/overview'
                    : link === 'Company Reports'
                    ? '/company-reports'
                    : link === 'Manage Departments'
                    ? '/manage-departments'
                    : link === 'Technology Overview'
                    ? '/technology-overview'
                    : link === 'Manage IT'
                    ? '/manage-it'
                    : link === 'HR Overview'
                    ? '/hr-overview'
                    : link === 'Manage Recruitment'
                    ? '/manage-recruitment'
                    : link === 'Finance Overview'
                    ? '/finance-overview'
                    : link === 'Budget Reports'
                    ? '/budget-reports'
                    : link === 'Research Projects'
                    ? '/research-projects'
                    : link === 'Customer Cases'
                    ? '/customer-cases'
                    : link === 'Team Overview'
                    ? '/team-overview'
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
