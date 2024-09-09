import React, { useContext } from "react";
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

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <div>Loading...</div>; // Fallback UI
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

  // Additional links and descriptions for each role
  const roleShortcuts = {
    Employee: [
      { name: "Profile", description: "Manage your profile details.", icon: <FaUser />, path: "/profile" },
      { name: "My Team", description: "See your team and manage tasks.", icon: <FaUsers />, path: "/my-team" },
      { name: "Messages", description: "Check your messages.", icon: <FaEnvelope />, path: "/messages" },
      { name: "Wellness System", description: "Access wellness resources.", icon: <FaHeartbeat />, path: "/wellness-dashboard" },
      { name: "Decision Rooms", description: "Participate in decisions.", icon: <FaVoteYea />, path: "/decision-rooms" },
      { name: "Meetings", description: "Manage your meetings.", icon: <FaCalendarAlt />, path: "/meeting-booking" },
    ],
    "Team Leader": [
      { name: "Manage Team", description: "Oversee team tasks and members.", icon: <FaUsers />, path: "/manage-team" },
      { name: "Team Overview", description: "View your team's progress.", icon: <FaChartLine />, path: "/team-overview" },
      { name: "Meetings", description: "Set up team meetings.", icon: <FaCalendarAlt />, path: "/meeting-booking" },
      { name: "Wellness System", description: "Access wellness tools for your team.", icon: <FaHeartbeat />, path: "/wellness-dashboard" },
      { name: "Collaborator Finder", description: "Find collaborators.", icon: <FaCogs />, path: "/collaborator-finder" },
      { name: "Messages", description: "Check team messages.", icon: <FaEnvelope />, path: "/messages" },
    ],
    CEO: [
      { name: "Company Reports", description: "View detailed reports.", icon: <FaChartLine />, path: "/company-reports" },
      { name: "Manage Departments", description: "Oversee all departments.", icon: <FaBuilding />, path: "/manage-departments" },
      { name: "Manage Users", description: "Oversee all users and roles.", icon: <FaUsers />, path: "/manage-users" },
      { name: "Collaborator Finder", description: "Find collaborators.", icon: <FaCogs />, path: "/collaborator-finder" },
      { name: "Wellness System", description: "Ensure the company's well-being.", icon: <FaHeartbeat />, path: "/wellness-dashboard" },
      { name: "Messages", description: "Review all communications.", icon: <FaEnvelope />, path: "/messages" },
    ],
    CTO: [
      { name: "Technology Overview", description: "Monitor the IT infrastructure.", icon: <FaChartLine />, path: "/technology-overview" },
      { name: "Manage IT", description: "Oversee IT management.", icon: <FaCogs />, path: "/manage-it" },
      { name: "Collaborator Finder", description: "Find technology partners.", icon: <FaCogs />, path: "/collaborator-finder" },
      { name: "Wellness System", description: "Access IT wellness resources.", icon: <FaHeartbeat />, path: "/wellness-dashboard" },
      { name: "Messages", description: "Check IT-related messages.", icon: <FaEnvelope />, path: "/messages" },
    ],
    "Director of HR": [
      { name: "HR Overview", description: "Manage HR tasks.", icon: <FaChartLine />, path: "/hr-overview" },
      { name: "Manage Users", description: "Manage user profiles.", icon: <FaUsers />, path: "/manage-users" },
      { name: "Collaborator Finder", description: "Find HR partners.", icon: <FaCogs />, path: "/collaborator-finder" },
      { name: "Wellness System", description: "Oversee employee wellness.", icon: <FaHeartbeat />, path: "/wellness-dashboard" },
      { name: "Messages", description: "Handle employee messages.", icon: <FaEnvelope />, path: "/messages" },
    ],
    "Director of Finance": [
      { name: "Finance Overview", description: "Manage finance tasks.", icon: <FaChartLine />, path: "/finance-overview" },
      { name: "Budget Reports", description: "View detailed budget reports.", icon: <FaChartLine />, path: "/budget-reports" },
      { name: "Collaborator Finder", description: "Find financial partners.", icon: <FaCogs />, path: "/collaborator-finder" },
      { name: "Wellness System", description: "Monitor financial wellness.", icon: <FaHeartbeat />, path: "/wellness-dashboard" },
      { name: "Messages", description: "Handle finance messages.", icon: <FaEnvelope />, path: "/messages" },
    ],
    "Research Scientist": [
      { name: "Research Projects", description: "Access your research tasks.", icon: <FaChartLine />, path: "/research-projects" },
      { name: "Collaborator Finder", description: "Find research collaborators.", icon: <FaCogs />, path: "/collaborator-finder" },
      { name: "Wellness System", description: "Manage research wellness.", icon: <FaHeartbeat />, path: "/wellness-dashboard" },
      { name: "Messages", description: "Check research-related messages.", icon: <FaEnvelope />, path: "/messages" },
    ],
    "Customer Support Specialist": [
      { name: "Customer Cases", description: "Manage customer support cases.", icon: <FaUsers />, path: "/customer-cases" },
      { name: "Messages", description: "Check support messages.", icon: <FaEnvelope />, path: "/messages" },
      { name: "Collaborator Finder", description: "Find support collaborators.", icon: <FaCogs />, path: "/collaborator-finder" },
      { name: "Wellness System", description: "Access wellness resources.", icon: <FaHeartbeat />, path: "/wellness-dashboard" },
      { name: "Meetings", description: "Handle support-related meetings.", icon: <FaCalendarAlt />, path: "/meeting-booking" },
    ],
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 bg-gray-100 p-10 overflow-y-auto">
        <h1 className="text-4xl font-bold mb-8 text-gray-700">
          {roleWelcomeMessages[user.role]}
        </h1>

        {/* Role-specific shortcuts with dynamic grid handling for more cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {roleShortcuts[user.role]?.map((shortcut, index) => (
            <Link to={shortcut.path} key={index}>
              <div
                className={`relative p-14 rounded-xl bg-card${index % 8} shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform duration-300 card-animation`}
              >
                <div className="absolute top-0 right-0 p-2 text-white text-lg">
                  {shortcut.icon}
                </div>
                <h3 className="text-white text-2xl font-bold">{shortcut.name}</h3>
                <p className="text-white mt-2 text-lg">{shortcut.description}</p>
                <div className="absolute bottom-0 right-0 p-2">
                  <span className="inline-block bg-white text-gray-700 text-sm px-3 py-1 rounded-full">Explore</span>
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