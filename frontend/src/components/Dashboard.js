import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  const links = {
    Employee: ['Profile', 'My Team'],
    'Department Manager': ['Profile', 'Manage Team', 'Reports'],
    Executive: ['Profile', 'Overview', 'Company Reports', 'Manage Departments'],
  };

  return (
    <div className="flex">
      <aside className="w-1/4 bg-gray-800 text-white h-screen p-6">
        <h2 className="text-xl mb-4">Dashboard</h2>
        <ul>
          {links[user.role].map((link, index) => (
            <li key={index} className="mb-2">
              <a href="#" className="hover:text-blue-400">{link}</a>
            </li>
          ))}
        </ul>
      </aside>
      <main className="w-3/4 p-6">
        <h1>Welcome, {user.name}</h1>
        <p>Role: {user.role}</p>
      </main>
    </div>
  );
};

export default Dashboard;
