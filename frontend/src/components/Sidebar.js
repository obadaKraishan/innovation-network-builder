import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaUser, FaSignOutAlt, FaTachometerAlt, FaUsers, FaChartLine, FaBuilding, FaCogs, FaUserShield, FaEnvelope, FaCalendarAlt } from 'react-icons/fa'; // Added FaUserShield for Manage Users
import AuthContext from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  if (!user) {
    return null;
  }

  const links = {
    Employee: [
      { name: 'Profile', icon: <FaUser />, path: '/profile' },
      { name: 'My Team', icon: <FaUsers />, path: '/my-team' },
      { name: 'My Meetings', icon: <FaCalendarAlt />, path: '/meeting-booking' },
      { name: 'Collaborator Finder', icon: <FaCogs />, path: '/collaborator-finder' },
      { name: 'Messages', icon: <FaEnvelope />, path: '/messages' },
    ],
    'Team Leader': [
      { name: 'Profile', icon: <FaUser />, path: '/profile' },
      { name: 'My Team', icon: <FaUsers />, path: '/my-team' },
      { name: 'Manage Team', icon: <FaUsers />, path: '/manage-team' },
      { name: 'Team Overview', icon: <FaChartLine />, path: '/team-overview' },
      { name: 'My Meetings', icon: <FaCalendarAlt />, path: '/meeting-booking' },
      { name: 'Collaborator Finder', icon: <FaCogs />, path: '/collaborator-finder' },
      { name: 'Messages', icon: <FaEnvelope />, path: '/messages' },
    ],
    'Department Manager': [
      { name: 'Profile', icon: <FaUser />, path: '/profile' },
      { name: 'Manage Team', icon: <FaUsers />, path: '/manage-team' },
      { name: 'Reports', icon: <FaChartLine />, path: '/reports' },
      { name: 'My Meetings', icon: <FaCalendarAlt />, path: '/meeting-booking' },
      { name: 'Collaborator Finder', icon: <FaCogs />, path: '/collaborator-finder' },
      { name: 'Messages', icon: <FaEnvelope />, path: '/messages' },
    ],
    CEO: [
      { name: 'Profile', icon: <FaUser />, path: '/profile' },
      { name: 'Overview', icon: <FaTachometerAlt />, path: '/overview' },
      { name: 'Company Reports', icon: <FaChartLine />, path: '/company-reports' },
      { name: 'Manage Departments', icon: <FaBuilding />, path: '/manage-departments' },
      { name: 'Manage Users', icon: <FaUserShield />, path: '/manage-users' }, // Added Manage Users
      { name: 'My Meetings', icon: <FaCalendarAlt />, path: '/meeting-booking' },
      { name: 'Collaborator Finder', icon: <FaCogs />, path: '/collaborator-finder' },
      { name: 'Messages', icon: <FaEnvelope />, path: '/messages' },
    ],
    CTO: [
      { name: 'Profile', icon: <FaUser />, path: '/profile' },
      { name: 'Technology Overview', icon: <FaTachometerAlt />, path: '/technology-overview' },
      { name: 'Manage IT', icon: <FaCogs />, path: '/manage-it' },
      { name: 'My Meetings', icon: <FaCalendarAlt />, path: '/meeting-booking' },
      { name: 'Collaborator Finder', icon: <FaCogs />, path: '/collaborator-finder' },
      { name: 'Messages', icon: <FaEnvelope />, path: '/messages' },
    ],
    'Director of HR': [
      { name: 'Profile', icon: <FaUser />, path: '/profile' },
      { name: 'HR Overview', icon: <FaTachometerAlt />, path: '/hr-overview' },
      { name: 'Manage Recruitment', icon: <FaUsers />, path: '/manage-recruitment' },
      { name: 'Manage Users', icon: <FaUserShield />, path: '/manage-users' }, // Added Manage Users
      { name: 'My Meetings', icon: <FaCalendarAlt />, path: '/meeting-booking' },
      { name: 'Collaborator Finder', icon: <FaCogs />, path: '/collaborator-finder' },
      { name: 'Messages', icon: <FaEnvelope />, path: '/messages' },
    ],
    'Director of Finance': [
      { name: 'Profile', icon: <FaUser />, path: '/profile' },
      { name: 'Finance Overview', icon: <FaChartLine />, path: '/finance-overview' },
      { name: 'Budget Reports', icon: <FaChartLine />, path: '/budget-reports' },
      { name: 'My Meetings', icon: <FaCalendarAlt />, path: '/meeting-booking' },
      { name: 'Collaborator Finder', icon: <FaCogs />, path: '/collaborator-finder' },
      { name: 'Messages', icon: <FaEnvelope />, path: '/messages' },
    ],
    'Research Scientist': [
      { name: 'Profile', icon: <FaUser />, path: '/profile' },
      { name: 'Research Projects', icon: <FaChartLine />, path: '/research-projects' },
      { name: 'My Meetings', icon: <FaCalendarAlt />, path: '/meeting-booking' },
      { name: 'Collaborator Finder', icon: <FaCogs />, path: '/collaborator-finder' },
      { name: 'Messages', icon: <FaEnvelope />, path: '/messages' },
    ],
    'Customer Support Specialist': [
      { name: 'Profile', icon: <FaUser />, path: '/profile' },
      { name: 'Customer Cases', icon: <FaUsers />, path: '/customer-cases' },
      { name: 'My Meetings', icon: <FaCalendarAlt />, path: '/meeting-booking' },
      { name: 'Collaborator Finder', icon: <FaCogs />, path: '/collaborator-finder' },
      { name: 'Messages', icon: <FaEnvelope />, path: '/messages' },
    ],
  };

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="w-64 bg-gradient-to-b from-blue-500 to-indigo-600 text-white p-6 h-full flex flex-col justify-between">
      <div>
        <h2 className="text-2xl font-semibold mb-6 text-white">Welcome Back...</h2>
        <ul className="space-y-4">
          <li>
            <Link
              to="/dashboard"
              className={`flex items-center space-x-3 text-lg ${
                isActive('/dashboard') ? 'text-white bg-indigo-700 rounded-md p-2' : 'text-gray-200 hover:text-white'
              }`}
            >
              <FaTachometerAlt />
              <span>Dashboard</span>
            </Link>
          </li>
          {links[user.role]?.map((link, index) => (
            <li key={index}>
              <Link
                to={link.path}
                className={`flex items-center space-x-3 text-lg ${
                  isActive(link.path) ? 'text-white bg-indigo-700 rounded-md p-2' : 'text-gray-200 hover:text-white'
                }`}
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <button
        onClick={logout}
        className="w-full bg-red-600 text-white p-3 rounded flex items-center justify-center hover:bg-red-700 mt-6 transition"
      >
        <FaSignOutAlt className="mr-2" />
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;
