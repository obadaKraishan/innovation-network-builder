// File: frontend/src/routes.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import CollaboratorFinder from './components/CollaboratorFinder';
import Profile from './components/Profile';
import MyTeam from './components/MyTeam';
import ManageTeam from './components/ManageTeam';
import TeamDetails from './components/TeamDetails';
import ManageDepartments from './components/ManageDepartments';
import EditDepartment from './components/EditDepartment'; 
import ManageUsers from './components/ManageUsers'; // Import the ManageUsers component
import AddUser from './components/AddUser'; // Import the AddUser component

const AppRoutes = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/collaborator-finder" element={<CollaboratorFinder />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/my-team" element={<MyTeam />} />
          <Route path="/manage-team" element={<ManageTeam />} />
          <Route path="/manage-departments" element={<ManageDepartments />} />
          <Route path="/edit-department/:id" element={<EditDepartment />} />
          <Route path="/manage-users" element={<ManageUsers />} /> {/* Route for Manage Users */}
          <Route path="/add-user" element={<AddUser />} /> {/* New route for Add User */}
          <Route path="/team-details/:id" element={<TeamDetails />} />
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default AppRoutes;
