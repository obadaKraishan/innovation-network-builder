// File: frontend/src/routes.js

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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
import BookMeeting from './components/BookMeeting';
import MeetingAvailability from './components/MeetingAvailability';

// New Components for Interest Groups
import InterestGroups from './components/InterestGroups';
import CreateInterestGroups from './components/CreateInterestGroups';
import InterestGroupDetails from './components/InterestGroupDetails';
import GroupsInvitations from './components/GroupsInvitations';
import EditInterestGroup from './components/EditInterestGroup';

// New Components for Decision Rooms
import DecisionRoomsDashboard from './components/DecisionRoomsDashboard';
import CreateDecisionRoom from './components/CreateDecisionRoom';
import DecisionRoomDetails from './components/DecisionRoomDetails';
import ProposalDetails from './components/ProposalDetails';
import VotingSection from './components/VotingSection';
import EditDecisionRoom from './components/EditDecisionRoom';
import DecisionRoomDiscussion from './components/DecisionRoomDiscussion';

const AppRoutes = () => {

  return (
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
          <Route path="/messages" element={<MessagesSystem />} />
          <Route path="/messages/create" element={<CreateMessage />} />
          <Route path="/messages/inbox" element={<MessagesInbox />} />
          <Route path="/messages/sent" element={<MessagesSent />} />
          <Route path="/messages/important" element={<MessagesImportant />} />
          <Route path="/messages/:id" element={<MessageDetails />} />
          <Route path="/meeting-booking" element={<MeetingBooking />} />
          <Route path="/book-meeting" element={<BookMeeting />} />
          <Route path="/meeting-availability" element={<MeetingAvailability />} />
          
          {/* New Routes for Personal Interest Groups */}
          <Route path="/interest-groups" element={<InterestGroups />} />
          <Route path="/create-interest-group" element={<CreateInterestGroups />} />
          <Route path="/interest-groups/:id" element={<InterestGroupDetails />} />
          <Route path="/group-invitations" element={<GroupsInvitations />} />
          <Route path="/edit-interest-group/:id" element={<EditInterestGroup />} />

          {/* New Routes for Decision Rooms */}
          <Route path="/decision-rooms" element={<DecisionRoomsDashboard />} />
          <Route path="/create-decision-room" element={<CreateDecisionRoom />} />
          <Route path="/decision-rooms/:id" element={<DecisionRoomDetails />} />
          <Route path="/decision-rooms/:id/proposal/:proposalId" element={<ProposalDetails />} />
          <Route path="/decision-rooms/:id/proposal/:proposalId/vote" element={<VotingSection />} />
          <Route path="/decision-rooms/:id/proposal/:proposalId/discussion" element={<DecisionRoomDiscussion />} />
          <Route path="/edit-decision-room/:id" element={<EditDecisionRoom />} />

          {/* Default redirect to login */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
  );
};

export default AppRoutes;
