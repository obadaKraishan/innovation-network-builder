import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaUser,
  FaChartLine,
  FaUsers,
  FaCogs,
  FaHeartbeat,
  FaCalendarAlt,
  FaEnvelope,
  FaBuilding,
  FaVoteYea,
} from "react-icons/fa";
import AuthContext from "../context/AuthContext";
import Sidebar from "./Sidebar";
import axios from "axios";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [recentMessages, setRecentMessages] = useState([]);
  const [upcomingMeetings, setUpcomingMeetings] = useState([]);

  // Fetch dynamic data based on user role
  useEffect(() => {
    // Fetch recent messages or tasks based on user role
    const fetchRecentMessages = async () => {
      try {
        const response = await axios.get("/api/messages/recent", {
          params: { userId: user._id },
        });
        setRecentMessages(response.data);
      } catch (error) {
        console.error("Error fetching recent messages:", error);
      }
    };

    const fetchUpcomingMeetings = async () => {
      try {
        const response = await axios.get("/api/meetings/upcoming", {
          params: { userId: user._id },
        });
        setUpcomingMeetings(response.data);
      } catch (error) {
        console.error("Error fetching upcoming meetings:", error);
      }
    };

    fetchRecentMessages();
    fetchUpcomingMeetings();
  }, [user]);

  if (!user) {
    return null;
  }

  // Welcome message based on role
  const roleWelcomeMessages = {
    Employee: "Welcome back! Here are your essential tools for staying connected and productive.",
    "Team Leader": "Welcome Team Leader! Manage your team and stay on top of everything.",
    CEO: "Welcome CEO! Here are the latest insights and management tools for the company.",
    CTO: "Welcome CTO! Oversee the technology infrastructure and manage IT.",
    "Director of HR": "Welcome HR Director! Manage recruitment and user interactions effectively.",
    "Director of Finance": "Welcome Finance Director! Manage budgets and reports efficiently.",
    "Research Scientist": "Welcome Researcher! Access your projects and collaborate with peers.",
    "Customer Support Specialist": "Welcome Support Specialist! Here are the tools to handle customer cases.",
  };

  // Additional links and categories for each role
  const roleShortcuts = {
    Employee: [
      { name: "Profile", icon: <FaUser />, path: "/profile" },
      { name: "My Team", icon: <FaUsers />, path: "/my-team" },
      { name: "Messages", icon: <FaEnvelope />, path: "/messages" },
      { name: "Wellness System", icon: <FaHeartbeat />, path: "/wellness-dashboard" },
      { name: "Decision Rooms", icon: <FaVoteYea />, path: "/decision-rooms" },
      { name: "Meetings", icon: <FaCalendarAlt />, path: "/meeting-booking" },
    ],
    "Team Leader": [
      { name: "Manage Team", icon: <FaUsers />, path: "/manage-team" },
      { name: "Team Overview", icon: <FaChartLine />, path: "/team-overview" },
      { name: "Meetings", icon: <FaCalendarAlt />, path: "/meeting-booking" },
      { name: "Wellness System", icon: <FaHeartbeat />, path: "/wellness-dashboard" },
      { name: "Collaborator Finder", icon: <FaCogs />, path: "/collaborator-finder" },
      { name: "Messages", icon: <FaEnvelope />, path: "/messages" },
    ],
    CEO: [
      { name: "Company Reports", icon: <FaChartLine />, path: "/company-reports" },
      { name: "Manage Departments", icon: <FaBuilding />, path: "/manage-departments" },
      { name: "Manage Users", icon: <FaUsers />, path: "/manage-users" },
      { name: "Collaborator Finder", icon: <FaCogs />, path: "/collaborator-finder" },
      { name: "Wellness System", icon: <FaHeartbeat />, path: "/wellness-dashboard" },
      { name: "Messages", icon: <FaEnvelope />, path: "/messages" },
    ],
    CTO: [
      { name: "Technology Overview", icon: <FaChartLine />, path: "/technology-overview" },
      { name: "Manage IT", icon: <FaCogs />, path: "/manage-it" },
      { name: "Collaborator Finder", icon: <FaCogs />, path: "/collaborator-finder" },
      { name: "Wellness System", icon: <FaHeartbeat />, path: "/wellness-dashboard" },
      { name: "Messages", icon: <FaEnvelope />, path: "/messages" },
    ],
    "Director of HR": [
      { name: "HR Overview", icon: <FaChartLine />, path: "/hr-overview" },
      { name: "Manage Users", icon: <FaUsers />, path: "/manage-users" },
      { name: "Collaborator Finder", icon: <FaCogs />, path: "/collaborator-finder" },
      { name: "Wellness System", icon: <FaHeartbeat />, path: "/wellness-dashboard" },
      { name: "Messages", icon: <FaEnvelope />, path: "/messages" },
    ],
    "Director of Finance": [
      { name: "Finance Overview", icon: <FaChartLine />, path: "/finance-overview" },
      { name: "Budget Reports", icon: <FaChartLine />, path: "/budget-reports" },
      { name: "Collaborator Finder", icon: <FaCogs />, path: "/collaborator-finder" },
      { name: "Wellness System", icon: <FaHeartbeat />, path: "/wellness-dashboard" },
      { name: "Messages", icon: <FaEnvelope />, path: "/messages" },
    ],
    "Research Scientist": [
      { name: "Research Projects", icon: <FaChartLine />, path: "/research-projects" },
      { name: "Collaborator Finder", icon: <FaCogs />, path: "/collaborator-finder" },
      { name: "Wellness System", icon: <FaHeartbeat />, path: "/wellness-dashboard" },
      { name: "Messages", icon: <FaEnvelope />, path: "/messages" },
    ],
    "Customer Support Specialist": [
      { name: "Customer Cases", icon: <FaUsers />, path: "/customer-cases" },
      { name: "Messages", icon: <FaEnvelope />, path: "/messages" },
      { name: "Collaborator Finder", icon: <FaCogs />, path: "/collaborator-finder" },
      { name: "Wellness System", icon: <FaHeartbeat />, path: "/wellness-dashboard" },
      { name: "Meetings", icon: <FaCalendarAlt />, path: "/meeting-booking" },
    ],
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 bg-gray-100 p-10 overflow-y-auto">
        <h1 className="text-4xl font-bold mb-8 text-gray-700">
          {roleWelcomeMessages[user.role]}
        </h1>

        {/* Dynamic section: Upcoming Meetings */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Upcoming Meetings</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {upcomingMeetings.map((meeting, index) => (
              <div
                key={index}
                className="bg-white shadow-lg p-6 rounded-lg transform hover:scale-105 transition-transform duration-300 hover:shadow-2xl"
              >
                <h3 className="text-lg font-semibold">{meeting.agenda}</h3>
                <p className="text-gray-600">{meeting.date}</p>
                <p className="text-gray-600">{meeting.time}</p>
                <p className="text-gray-600">Status: {meeting.status}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic section: Recent Messages */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Recent Messages</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recentMessages.map((message, index) => (
              <div
                key={index}
                className="bg-white shadow-lg p-6 rounded-lg transform hover:scale-105 transition-transform duration-300 hover:shadow-2xl"
              >
                <h3 className="text-lg font-semibold">{message.subject}</h3>
                <p className="text-gray-600">From: {message.sender.name}</p>
                <p className="text-gray-600">{message.body.slice(0, 50)}...</p>
              </div>
            ))}
          </div>
        </div>

        {/* Role-specific shortcuts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {roleShortcuts[user.role]?.map((shortcut, index) => (
            <Link to={shortcut.path} key={index}>
              <div className="bg-white shadow-lg p-8 rounded-xl transform hover:scale-105 transition-transform duration-300 hover:shadow-2xl">
                <div className="flex items-center space-x-4">
                  <div className="text-indigo-600 text-5xl">{shortcut.icon}</div>
                  <div className="text-xl font-semibold text-gray-800">
                    {shortcut.name}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;