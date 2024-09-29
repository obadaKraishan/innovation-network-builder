// File: frontend/src/components/Sidebar.js
import React, { useContext, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaUser,
  FaSignOutAlt,
  FaTachometerAlt,
  FaUsers,
  FaChartLine,
  FaBuilding,
  FaCogs,
  FaUserShield,
  FaEnvelope,
  FaCalendarAlt,
  FaLayerGroup,
  FaVoteYea,
  FaHeartbeat,
  FaBell,
  FaLightbulb,
  FaTools,
  FaTicketAlt,
  FaBook,
  FaChalkboardTeacher,
  FaGraduationCap,
  FaPlusCircle,
} from "react-icons/fa";
import AuthContext from "../context/AuthContext";

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  useEffect(() => {
    if (user) {
      console.log("User data in Sidebar:", user);
    }
  }, [user]);

  if (!user) {
    return null; // Return null if user data is not present to prevent sidebar from showing without user info
  }

  // Check if the user is a Technical Support Manager or Specialist
  const isTechnicalSupportManager = user?.position === "Technical Support Manager";
  const isTechnicalSupportSpecialist = user?.position === "Technical Support Specialist";

  // Sidebar links categorized by functionality
  const links = {
    Employee: [
      {
        category: "Main",
        items: [
          { name: "Dashboard", icon: <FaTachometerAlt />, path: "/dashboard" },
          { name: "Profile", icon: <FaUser />, path: "/profile" },
          { name: "Notifications", icon: <FaBell />, path: "/notifications" }
        ],
      },
      {
        category: "Team",
        items: [
          { name: "My Team", icon: <FaUsers />, path: "/my-team" },
          { name: "Decision Rooms", icon: <FaVoteYea />, path: "/decision-rooms" },
        ],
      },
      {
        category: "Collaboration",
        items: [
          { name: "Interest Groups", icon: <FaLayerGroup />, path: "/interest-groups" },
          { name: "Meetings", icon: <FaCalendarAlt />, path: "/meeting-booking" },
          { name: "Messages", icon: <FaEnvelope />, path: "/messages" },
          { name: "Collaborator Finder", icon: <FaCogs />, path: "/collaborator-finder" },
          { name: "Innovation Hub", icon: <FaLightbulb />, path: "/innovation-dashboard" },
        ],
      },
      {
        category: "Wellness",
        items: [{ name: "Wellness System", icon: <FaHeartbeat />, path: "/wellness-dashboard" }],
      },
      {
        category: "E-Learning",
        items: [
          { name: "Course Catalog", icon: <FaBook />, path: "/courses" },
          { name: "My Progress", icon: <FaGraduationCap />, path: "/course-progress" },
        ],
      },
    ],
    "Department Manager": [
      {
        category: "Main",
        items: [
          { name: "Dashboard", icon: <FaTachometerAlt />, path: "/dashboard" },
          { name: "Profile", icon: <FaUser />, path: "/profile" },
          { name: "Notifications", icon: <FaBell />, path: "/notifications" }
        ],
      },
      {
        category: "Team Management",
        items: [
          { name: "My Team", icon: <FaUsers />, path: "/my-team" },
          { name: "Manage Team", icon: <FaUsers />, path: "/manage-team" },
          { name: "Team Overview", icon: <FaChartLine />, path: "/team-overview" },
        ],
      },
      {
        category: "Collaboration",
        items: [
          { name: "Decision Rooms", icon: <FaVoteYea />, path: "/decision-rooms" },
          { name: "Interest Groups", icon: <FaLayerGroup />, path: "/interest-groups" },
          { name: "Meetings", icon: <FaCalendarAlt />, path: "/meeting-booking" },
          { name: "Messages", icon: <FaEnvelope />, path: "/messages" },
          { name: "Collaborator Finder", icon: <FaCogs />, path: "/collaborator-finder" },
          { name: "Innovation Hub", icon: <FaLightbulb />, path: "/innovation-dashboard" },
        ],
      },
      {
        category: "Wellness",
        items: [{ name: "Wellness System", icon: <FaHeartbeat />, path: "/wellness-dashboard" }],
      },
      {
        category: "E-Learning Management",
        items: [
          { name: "Manage Courses", icon: <FaChalkboardTeacher />, path: "/course-management" },
          { name: "Course Analytics", icon: <FaChartLine />, path: "/course-analytics" },
          { name: "Create Course", icon: <FaPlusCircle />, path: "/create-course" },
          { name: "Create Quiz", icon: <FaPlusCircle />, path: "/create-quiz" },
        ],
      },
    ],
    "Team Leader": [
      {
        category: "Main",
        items: [
          { name: "Dashboard", icon: <FaTachometerAlt />, path: "/dashboard" },
          { name: "Profile", icon: <FaUser />, path: "/profile" },
          { name: "Notifications", icon: <FaBell />, path: "/notifications" }
        ],
      },
      {
        category: "Team Management",
        items: [
          { name: "My Team", icon: <FaUsers />, path: "/my-team" },
          { name: "Manage Team", icon: <FaUsers />, path: "/manage-team" },
          { name: "Team Overview", icon: <FaChartLine />, path: "/team-overview" },
        ],
      },
      {
        category: "Collaboration",
        items: [
          { name: "Decision Rooms", icon: <FaVoteYea />, path: "/decision-rooms" },
          { name: "Interest Groups", icon: <FaLayerGroup />, path: "/interest-groups" },
          { name: "Meetings", icon: <FaCalendarAlt />, path: "/meeting-booking" },
          { name: "Messages", icon: <FaEnvelope />, path: "/messages" },
          { name: "Collaborator Finder", icon: <FaCogs />, path: "/collaborator-finder" },
          { name: "Innovation Hub", icon: <FaLightbulb />, path: "/innovation-dashboard" },
        ],
      },
      {
        category: "Wellness",
        items: [{ name: "Wellness System", icon: <FaHeartbeat />, path: "/wellness-dashboard" }],
      },
      {
        category: "E-Learning Management",
        items: [
          { name: "Manage Courses", icon: <FaChalkboardTeacher />, path: "/course-management" },
          { name: "Course Analytics", icon: <FaChartLine />, path: "/course-analytics" },
          { name: "Create Course", icon: <FaPlusCircle />, path: "/create-course" },
          { name: "Create Quiz", icon: <FaPlusCircle />, path: "/create-quiz" },
        ],
      },
    ],
    CEO: [
      {
        category: "Main",
        items: [
          { name: "Dashboard", icon: <FaTachometerAlt />, path: "/dashboard" },
          { name: "Profile", icon: <FaUser />, path: "/profile" },
          { name: "Company Reports", icon: <FaChartLine />, path: "/company-reports" },
          { name: "Notifications", icon: <FaBell />, path: "/notifications" }
        ],
      },
      {
        category: "Management",
        items: [
          { name: "Manage Departments", icon: <FaBuilding />, path: "/manage-departments" },
          { name: "Manage Users", icon: <FaUserShield />, path: "/manage-users" },
        ],
      },
      {
        category: "Collaboration",
        items: [
          { name: "Decision Rooms", icon: <FaVoteYea />, path: "/decision-rooms" },
          { name: "Interest Groups", icon: <FaLayerGroup />, path: "/interest-groups" },
          { name: "Meetings", icon: <FaCalendarAlt />, path: "/meeting-booking" },
          { name: "Messages", icon: <FaEnvelope />, path: "/messages" },
          { name: "Collaborator Finder", icon: <FaCogs />, path: "/collaborator-finder" },
          { name: "Innovation Hub", icon: <FaLightbulb />, path: "/innovation-dashboard" },
        ],
      },
      {
        category: "Wellness",
        items: [{ name: "Wellness System", icon: <FaHeartbeat />, path: "/wellness-dashboard" }],
      },
      {
        category: "E-Learning Management",
        items: [
          { name: "Manage Courses", icon: <FaChalkboardTeacher />, path: "/course-management" },
          { name: "Course Analytics", icon: <FaChartLine />, path: "/course-analytics" },
          { name: "Create Course", icon: <FaPlusCircle />, path: "/create-course" },
          { name: "Create Quiz", icon: <FaPlusCircle />, path: "/create-quiz" },
        ],
      },
    ],
    CTO: [
      {
        category: "Main",
        items: [
          { name: "Dashboard", icon: <FaTachometerAlt />, path: "/dashboard" },
          { name: "Profile", icon: <FaUser />, path: "/profile" },
          { name: "Notifications", icon: <FaBell />, path: "/notifications" }
        ],
      },
      {
        category: "Technology",
        items: [
          { name: "Technology Overview", icon: <FaTachometerAlt />, path: "/technology-overview" },
          { name: "Manage IT", icon: <FaCogs />, path: "/manage-it" },
        ],
      },
      {
        category: "Collaboration",
        items: [
          { name: "Decision Rooms", icon: <FaVoteYea />, path: "/decision-rooms" },
          { name: "Interest Groups", icon: <FaLayerGroup />, path: "/interest-groups" },
          { name: "Meetings", icon: <FaCalendarAlt />, path: "/meeting-booking" },
          { name: "Messages", icon: <FaEnvelope />, path: "/messages" },
          { name: "Collaborator Finder", icon: <FaCogs />, path: "/collaborator-finder" },
          { name: "Innovation Hub", icon: <FaLightbulb />, path: "/innovation-dashboard" },
        ],
      },
      {
        category: "Wellness",
        items: [{ name: "Wellness System", icon: <FaHeartbeat />, path: "/wellness-dashboard" }],
      },
      {
        category: "E-Learning Management",
        items: [
          { name: "Manage Courses", icon: <FaChalkboardTeacher />, path: "/course-management" },
          { name: "Course Analytics", icon: <FaChartLine />, path: "/course-analytics" },
          { name: "Create Course", icon: <FaPlusCircle />, path: "/create-course" },
          { name: "Create Quiz", icon: <FaPlusCircle />, path: "/create-quiz" },
        ],
      },
    ],
    "Director of HR": [
      {
        category: "Main",
        items: [
          { name: "Dashboard", icon: <FaTachometerAlt />, path: "/dashboard" },
          { name: "Profile", icon: <FaUser />, path: "/profile" },
          { name: "Notifications", icon: <FaBell />, path: "/notifications" }
        ],
      },
      {
        category: "HR Management",
        items: [
          { name: "HR Overview", icon: <FaTachometerAlt />, path: "/hr-overview" },
          { name: "Manage Recruitment", icon: <FaUsers />, path: "/manage-recruitment" },
          { name: "Manage Users", icon: <FaUserShield />, path: "/manage-users" },
        ],
      },
      {
        category: "Collaboration",
        items: [
          { name: "Decision Rooms", icon: <FaVoteYea />, path: "/decision-rooms" },
          { name: "Interest Groups", icon: <FaLayerGroup />, path: "/interest-groups" },
          { name: "Meetings", icon: <FaCalendarAlt />, path: "/meeting-booking" },
          { name: "Messages", icon: <FaEnvelope />, path: "/messages" },
          { name: "Collaborator Finder", icon: <FaCogs />, path: "/collaborator-finder" },
          { name: "Innovation Hub", icon: <FaLightbulb />, path: "/innovation-dashboard" },
        ],
      },
      {
        category: "Wellness",
        items: [{ name: "Wellness System", icon: <FaHeartbeat />, path: "/wellness-dashboard" }],
      },
      {
        category: "E-Learning Management",
        items: [
          { name: "Manage Courses", icon: <FaChalkboardTeacher />, path: "/course-management" },
          { name: "Course Analytics", icon: <FaChartLine />, path: "/course-analytics" },
          { name: "Create Course", icon: <FaPlusCircle />, path: "/create-course" },
          { name: "Create Quiz", icon: <FaPlusCircle />, path: "/create-quiz" },
        ],
      },
    ],
    "Director of Finance": [
      {
        category: "Main",
        items: [
          { name: "Dashboard", icon: <FaTachometerAlt />, path: "/dashboard" },
          { name: "Profile", icon: <FaUser />, path: "/profile" },
          { name: "Notifications", icon: <FaBell />, path: "/notifications" }
        ],
      },
      {
        category: "Finance",
        items: [
          { name: "Finance Overview", icon: <FaChartLine />, path: "/finance-overview" },
          { name: "Budget Reports", icon: <FaChartLine />, path: "/budget-reports" },
        ],
      },
      {
        category: "Collaboration",
        items: [
          { name: "Decision Rooms", icon: <FaVoteYea />, path: "/decision-rooms" },
          { name: "Interest Groups", icon: <FaLayerGroup />, path: "/interest-groups" },
          { name: "Meetings", icon: <FaCalendarAlt />, path: "/meeting-booking" },
          { name: "Messages", icon: <FaEnvelope />, path: "/messages" },
          { name: "Collaborator Finder", icon: <FaCogs />, path: "/collaborator-finder" },
          { name: "Innovation Hub", icon: <FaLightbulb />, path: "/innovation-dashboard" },
        ],
      },
      {
        category: "Wellness",
        items: [{ name: "Wellness System", icon: <FaHeartbeat />, path: "/wellness-dashboard" }],
      },
      {
        category: "E-Learning Management",
        items: [
          { name: "Manage Courses", icon: <FaChalkboardTeacher />, path: "/course-management" },
          { name: "Course Analytics", icon: <FaChartLine />, path: "/course-analytics" },
          { name: "Create Course", icon: <FaPlusCircle />, path: "/create-course" },
          { name: "Create Quiz", icon: <FaPlusCircle />, path: "/create-quiz" },
        ],
      },
    ],
    "Research Scientist": [
      {
        category: "Main",
        items: [
          { name: "Dashboard", icon: <FaTachometerAlt />, path: "/dashboard" },
          { name: "Profile", icon: <FaUser />, path: "/profile" },
          { name: "Notifications", icon: <FaBell />, path: "/notifications" }
        ],
      },
      {
        category: "Research",
        items: [
          { name: "Research Projects", icon: <FaChartLine />, path: "/research-projects" },
        ],
      },
      {
        category: "Collaboration",
        items: [
          { name: "Decision Rooms", icon: <FaVoteYea />, path: "/decision-rooms" },
          { name: "Interest Groups", icon: <FaLayerGroup />, path: "/interest-groups" },
          { name: "Meetings", icon: <FaCalendarAlt />, path: "/meeting-booking" },
          { name: "Messages", icon: <FaEnvelope />, path: "/messages" },
          { name: "Collaborator Finder", icon: <FaCogs />, path: "/collaborator-finder" },
          { name: "Innovation Hub", icon: <FaLightbulb />, path: "/innovation-dashboard" },
        ],
      },
      {
        category: "Wellness",
        items: [{ name: "Wellness System", icon: <FaHeartbeat />, path: "/wellness-dashboard" }],
      },
      {
        category: "E-Learning",
        items: [
          { name: "Course Catalog", icon: <FaBook />, path: "/courses" },
          { name: "My Progress", icon: <FaGraduationCap />, path: "/course-progress" },
        ],
      },
    ],
    "Customer Support Specialist": [
      {
        category: "Main",
        items: [
          { name: "Dashboard", icon: <FaTachometerAlt />, path: "/dashboard" },
          { name: "Profile", icon: <FaUser />, path: "/profile" },
          { name: "Notifications", icon: <FaBell />, path: "/notifications" }
        ],
      },
      {
        category: "Support",
        items: [{ name: "Customer Cases", icon: <FaUsers />, path: "/customer-cases" }],
      },
      {
        category: "Collaboration",
        items: [
          { name: "Decision Rooms", icon: <FaVoteYea />, path: "/decision-rooms" },
          { name: "Interest Groups", icon: <FaLayerGroup />, path: "/interest-groups" },
          { name: "Meetings", icon: <FaCalendarAlt />, path: "/meeting-booking" },
          { name: "Messages", icon: <FaEnvelope />, path: "/messages" },
          { name: "Collaborator Finder", icon: <FaCogs />, path: "/collaborator-finder" },
          { name: "Innovation Hub", icon: <FaLightbulb />, path: "/innovation-dashboard" },
        ],
      },
      {
        category: "Wellness",
        items: [{ name: "Wellness System", icon: <FaHeartbeat />, path: "/wellness-dashboard" }],
      },
      {
        category: "E-Learning",
        items: [
          { name: "Course Catalog", icon: <FaBook />, path: "/courses" },
          { name: "My Progress", icon: <FaGraduationCap />, path: "/course-progress" },
        ],
      },
    ],
  };

  // Check if the current path is active for styling
  const isActive = (path) => location.pathname === path;

  return (
    <aside className="w-65 bg-gradient-to-b from-blue-500 to-indigo-600 text-white h-screen flex flex-col justify-between shadow-lg">
      <div className="overflow-y-auto max-h-[100vh] sidebar-container">
        <ul className="space-y-3 p-6">
          {/* Map through user role-based links */}
          {links[user.role]?.map((category, index) => (
            <li key={index} className="border-b border-indigo-400 pb-1">
              <h3 className="text-lg font-bold text-gray-200 mb-2">{category.category}</h3>
              <ul className="space-y-1 pl-1">
                {category.items.map((link, i) => (
                  <li key={i}>
                    <Link
                      to={link.path}
                      className={`flex items-center space-x-2 text-lg transition-all duration-300 ease-in-out ${
                        isActive(link.path)
                          ? "text-white bg-indigo-700 rounded-md p-2 shadow-md"
                          : "text-gray-200 hover:text-white hover:bg-indigo-600 p-2 rounded-md"
                      }`}
                    >
                      {link.icon}
                      <span>{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}

          {/* Technical Support Links - Visible to all */}
          {!isTechnicalSupportManager && !isTechnicalSupportSpecialist && (
            <li className="border-b border-indigo-400 pb-1">
              <h3 className="text-lg font-bold text-gray-200 mb-2">Technical Support</h3>
              <ul className="space-y-1 pl-1">
                <li>
                  <Link
                    to="/technical-support-dashboard"
                    className={`flex items-center space-x-2 text-lg transition-all duration-300 ease-in-out ${
                      isActive("/technical-support-dashboard")
                        ? "text-white bg-indigo-700 rounded-md p-2 shadow-md"
                        : "text-gray-200 hover:text-white hover:bg-indigo-600 p-2 rounded-md"
                    }`}
                  >
                    <FaTools />
                    <span>Technical Support Dashboard</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/submit-ticket"
                    className={`flex items-center space-x-2 text-lg transition-all duration-300 ease-in-out ${
                      isActive("/submit-ticket")
                        ? "text-white bg-indigo-700 rounded-md p-2 shadow-md"
                        : "text-gray-200 hover:text-white hover:bg-indigo-600 p-2 rounded-md"
                    }`}
                  >
                    <FaTicketAlt />
                    <span>Submit a Ticket</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/ticket-history"
                    className={`flex items-center space-x-2 text-lg transition-all duration-300 ease-in-out ${
                      isActive("/ticket-history")
                        ? "text-white bg-indigo-700 rounded-md p-2 shadow-md"
                        : "text-gray-200 hover:text-white hover:bg-indigo-600 p-2 rounded-md"
                    }`}
                  >
                    <FaTicketAlt />
                    <span>Ticket History</span>
                  </Link>
                </li>
              </ul>
            </li>
          )}

          {/* Support Management Links - Visible to Technical Support Manager and Specialist Only */}
          {(isTechnicalSupportManager || isTechnicalSupportSpecialist) && (
            <li className="border-b border-indigo-400 pb-1">
              <h3 className="text-lg font-bold text-gray-200 mb-2">Technical Support Management</h3>
              <ul className="space-y-1 pl-1">
                <li>
                  <Link
                    to="/support-management"
                    className={`flex items-center space-x-2 text-lg transition-all duration-300 ease-in-out ${
                      isActive("/support-management")
                        ? "text-white bg-indigo-700 rounded-md p-2 shadow-md"
                        : "text-gray-200 hover:text-white hover:bg-indigo-600 p-2 rounded-md"
                    }`}
                  >
                    <FaTools />
                    <span>Support Ticket Management</span>
                  </Link>
                </li>

                {/* New Ticket Calendar Link */}
                <li>
                  <Link
                    to="/tickets-calendar"
                    className={`flex items-center space-x-2 text-lg transition-all duration-300 ease-in-out ${
                      isActive("/tickets-calendar")
                        ? "text-white bg-indigo-700 rounded-md p-2 shadow-md"
                        : "text-gray-200 hover:text-white hover:bg-indigo-600 p-2 rounded-md"
                    }`}
                  >
                    <FaCalendarAlt />
                    <span>Ticket Calendar</span>
                  </Link>
                </li>
                
                {/* New Open Ticket Link */}
                <li>
                  <Link
                    to="/open-tickets"
                    className={`flex items-center space-x-2 text-lg transition-all duration-300 ease-in-out ${
                      isActive("/open-tickets")
                        ? "text-white bg-indigo-700 rounded-md p-2 shadow-md"
                        : "text-gray-200 hover:text-white hover:bg-indigo-600 p-2 rounded-md"
                    }`}
                  >
                    <FaTicketAlt />
                    <span>Open Tickets</span>
                  </Link>
                </li>
              </ul>
            </li>
          )}
        </ul>
      </div>
      <div className="p-6">
        <button
          onClick={logout}
          className="w-full bg-red-600 text-white p-3 rounded flex items-center justify-center hover:bg-red-700 transition-all ease-in-out"
        >
          <FaSignOutAlt className="mr-2" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
