import React from 'react';
import Sidebar from './Sidebar';

const Dashboard = () => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="w-3/4 p-6">
        <h1>Welcome to the Dashboard</h1>
        <p>Select a menu option from the sidebar to get started.</p>
      </main>
    </div>
  );
};

export default Dashboard;
