import React from 'react';
import Sidebar from './Sidebar';
import CollaboratorFinder from './CollaboratorFinder'; // Import the new component

const Dashboard = () => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="w-3/4 p-6">
        <h1>Welcome to the Dashboard</h1>
        <CollaboratorFinder /> {/* Add the Collaborator Finder here */}
      </main>
    </div>
  );
};

export default Dashboard;
