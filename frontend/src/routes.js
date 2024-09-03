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
import ManageUsers from './components/ManageUsers';
import AddUser from './components/AddUser';
import UserDetails from './components/UserDetails';
import MessagesSystem from './components/MessagesSystem';
import CreateMessage from './components/CreateMessage';
import MessagesInbox from './components/MessagesInbox';
import MessagesSent from './components/MessagesSent';
import MessagesImportant from './components/MessagesImportant';
import MessageDetails from './components/MessageDetails';
import MeetingBooking from './components/MeetingBooking';


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
          <Route path="/manage-users" element={<ManageUsers />} />
          <Route path="/add-user" element={<AddUser />} />
          <Route path="/team-details/:id" element={<TeamDetails />} />
          <Route path="/manage-users/:id" element={<UserDetails />} />
          <Route path="/messages" element={<MessagesSystem />} /> {/* New Messages System Route */}
          <Route path="/messages/create" element={<CreateMessage />} /> {/* Create Message Route */}
          <Route path="/messages/inbox" element={<MessagesInbox />} /> {/* Inbox Route */}
          <Route path="/messages/sent" element={<MessagesSent />} /> {/* Sent Messages Route */}
          <Route path="/messages/important" element={<MessagesImportant />} /> {/* Important Messages Route */}
          <Route path="/messages/:id" element={<MessageDetails />} /> {/* Message Details Route */}
          <Route path="/meeting-booking" element={<MeetingBooking />} />
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default AppRoutes;
