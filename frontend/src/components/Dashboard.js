import React from 'react';
import Sidebar from './Sidebar';

const Dashboard = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 bg-gray-100 overflow-y-auto p-6">
        <h1 className="text-3xl font-bold">Welcome to the Dashboard</h1>
        <p className="mt-4">Use the menu on the left to navigate through the features.</p>
      </main>
    </div>
  );
};

export default Dashboard;
