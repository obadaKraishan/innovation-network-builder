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

// Wellness Components
import WellnessDashboard from './components/WellnessDashboard';
import CreateSurvey from './components/CreateSurvey';
import SubmitFeedback from './components/SubmitFeedback';
import WellnessResources from './components/WellnessResources';
import PersonalizedRecommendations from './components/PersonalizedRecommendations';
import EditWellnessSurvey from './components/EditWellnessSurvey';
import WellnessFeedbackDetails from './components/WellnessFeedbackDetails';
import WellnessEditResource from './components/WellnessEditResource';
import WellnessEditRecommendation from './components/WellnessEditRecommendation';

// New Components for Innovation Pipeline System
import InnovationDashboard from './components/InnovationDashboard';
import IdeaSubmissionForm from './components/IdeaSubmissionForm';
import IdeaDetails from './components/IdeaDetails';
import InnovationRoadmap from './components/InnovationRoadmap';
import InnovationLeaderboard from './components/InnovationLeaderboard';

// Notification components
import NotificationsDashboard from './components/NotificationsDashboard';
import NotificationDetails from './components/NotificationDetails';

// Customer Support Ticket System
import TechnicalSupportDashboard from './components/TechnicalSupportDashboard'; 
import TicketSubmission from './components/TicketSubmission';
import TicketHistory from './components/TicketHistory';
import OpenTickets from './components/OpenTickets';
import SupportTicketManagement from './components/SupportTicketManagement';

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

          {/* Wellness Routes */}
          <Route path="/wellness-dashboard" element={<WellnessDashboard />} />
          <Route path="/wellness/create-survey" element={<CreateSurvey />} />
          <Route path="/wellness/submit-feedback" element={<SubmitFeedback />} />
          <Route path="/wellness/resources" element={<WellnessResources />} />
          <Route path="/wellness/recommendations" element={<PersonalizedRecommendations />} />
          <Route path="/wellness/edit-survey/:surveyId" element={<EditWellnessSurvey />} />
          <Route path="/wellness/feedback-details/:feedbackId" element={<WellnessFeedbackDetails />} />
          <Route path="/wellness/edit-resource/:resourceId" element={<WellnessEditResource />} />
          <Route path="/wellness/edit-recommendation/:recommendationId" element={<WellnessEditRecommendation />} />

          {/* New Routes for Innovation Pipeline System */}
          <Route path="/innovation-dashboard" element={<InnovationDashboard />} />
          <Route path="/submit-idea" element={<IdeaSubmissionForm />} />
          <Route path="/innovation/idea/:id" element={<IdeaDetails />} />
          <Route path="/innovation-roadmap" element={<InnovationRoadmap />} />
          <Route path="/innovation-leaderboard" element={<InnovationLeaderboard />} />
          
          {/* Notifications Routes */}
          <Route path="/notifications" element={<NotificationsDashboard />} />
          <Route path="/notifications/:id" element={<NotificationDetails />} />

          {/* Technical Support Ticket System */}
          <Route path="/technical-support-dashboard" element={<TechnicalSupportDashboard />} /> 
          <Route path="/submit-ticket" element={<TicketSubmission />} />
          <Route path="/ticket-history" element={<TicketHistory />} />
          <Route path="/open-tickets" element={<OpenTickets />} />
          <Route path="/support-management" element={<SupportTicketManagement />} />

          {/* Default redirect to login */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
  );
};

export default AppRoutes;
