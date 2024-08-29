import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);

  // Check if user is null
  if (!user) {
    return null; // or return a loading indicator or a placeholder
  }

  const links = {
    Employee: ['Profile', 'My Team'],
    'Department Manager': ['Profile', 'Manage Team', 'Reports'],
    Executive: ['Profile', 'Overview', 'Company Reports', 'Manage Departments'],
  };

  return (
    <aside className="w-1/4 bg-gray-800 text-white h-screen p-6">
      <h2 className="text-xl mb-4">Dashboard</h2>
      <ul>
        {links[user.role]?.map((link, index) => (
          <li key={index} className="mb-2">
            <a href="#" className="hover:text-blue-400">{link}</a>
          </li>
        ))}
      </ul>
      <button
        onClick={logout}
        className="mt-6 w-full bg-red-500 text-white p-2 rounded hover:bg-red-700"
      >
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;
