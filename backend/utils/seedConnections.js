const mongoose = require('mongoose');
const Connection = require('../models/connectionModel');
const User = require('../models/userModel');
const dotenv = require('dotenv');
const connectDB = require('../config/db');

// Load environment variables manually
dotenv.config({ path: './backend/.env' });

connectDB();

const seedConnections = async () => {
  try {
    await Connection.deleteMany({});

    const users = await User.find({});

    const getUserId = (condition) => {
      const user = users.find(condition);
      return user ? user._id : null;
    };

    const connections = [
      // Executive Team Connections
      {
        userA: getUserId(user => user.role === 'CEO'), // Robert CEO
        userB: getUserId(user => user.role === 'CTO'), // Linda Brown
        connectionType: 'Strong Tie',
      },
      {
        userA: getUserId(user => user.role === 'CEO'), // Robert CEO
        userB: getUserId(user => user.role === 'Director of HR'), // James Director
        connectionType: 'Strong Tie',
      },
      {
        userA: getUserId(user => user.role === 'CEO'), // Robert CEO
        userB: getUserId(user => user.role === 'Director of Finance'), // Alice Johnson
        connectionType: 'Strong Tie',
      },
      {
        userA: getUserId(user => user.role === 'CTO'), // Linda Brown
        userB: getUserId(user => user.position === 'Software Development Manager'), // John Doe
        connectionType: 'Strong Tie',
      },

      // Cross-Department Connections
      {
        userA: getUserId(user => user.position === 'HR Manager'), // Jane Smith
        userB: getUserId(user => user.position === 'Sales Representative'), // Bob Brown
        connectionType: 'Weak Tie',
      },
      {
        userA: getUserId(user => user.position === 'Financial Analyst Lead'), // Alice Johnson
        userB: getUserId(user => user.position === 'Digital Marketing Specialist'), // Charlie Davis
        connectionType: 'Weak Tie',
      },
      {
        userA: getUserId(user => user.position === 'Operations Specialist'), // Emily Green
        userB: getUserId(user => user.position === 'Product Manager'), // Fiona White
        connectionType: 'Weak Tie',
      },
      {
        userA: getUserId(user => user.position === 'Research Scientist'), // George King
        userB: getUserId(user => user.position === 'Customer Support Specialist'), // Hannah Lee
        connectionType: 'Weak Tie',
      },

      // Department-Specific Connections
      {
        userA: getUserId(user => user.position === 'Software Development Manager'), // John Doe
        userB: getUserId(user => user.position === 'Frontend Developer'), // Michael Green
        connectionType: 'Strong Tie',
      },
      {
        userA: getUserId(user => user.position === 'Software Development Manager'), // John Doe
        userB: getUserId(user => user.position === 'Backend Developer'), // David White
        connectionType: 'Strong Tie',
      },
      {
        userA: getUserId(user => user.position === 'Network Security Team Lead'), // Sara Williams
        userB: getUserId(user => user.position === 'DevOps Engineer'), // Robert Brown
        connectionType: 'Strong Tie',
      },
      {
        userA: getUserId(user => user.position === 'Recruitment Lead'), // Laura Adams
        userB: getUserId(user => user.position === 'Compensation Specialist'), // Mark Johnson
        connectionType: 'Strong Tie',
      },
      {
        userA: getUserId(user => user.position === 'HR Manager'), // Jane Smith
        userB: getUserId(user => user.position === 'Recruitment Lead'), // Laura Adams
        connectionType: 'Strong Tie',
      },

      // Similar Roles Across Departments
      {
        userA: getUserId(user => user.role === 'Department Manager' && user.department && user.department.name === 'Legal'), // David Harris
        userB: getUserId(user => user.role === 'Department Manager' && user.department && user.department.name === 'Finance'), // Alice Johnson
        connectionType: 'Weak Tie',
      },
      {
        userA: getUserId(user => user.position === 'Legal Manager'), // David Harris
        userB: getUserId(user => user.position === 'Corporate Lawyer'), // Sophia White
        connectionType: 'Strong Tie',
      },
      {
        userA: getUserId(user => user.position === 'Sales Representative'), // Bob Brown
        userB: getUserId(user => user.position === 'International Sales Specialist'), // Rachel Green
        connectionType: 'Strong Tie',
      },

      // Additional Connections
      {
        userA: getUserId(user => user.position === 'HR Manager'), // Jane Smith
        userB: getUserId(user => user.position === 'Customer Support Specialist'), // Hannah Lee
        connectionType: 'Weak Tie',
      },
      {
        userA: getUserId(user => user.position === 'Digital Marketing Specialist'), // Charlie Davis
        userB: getUserId(user => user.position === 'Operations Specialist'), // Emily Green
        connectionType: 'Weak Tie',
      },
      {
        userA: getUserId(user => user.position === 'Sales Representative'), // Bob Brown
        userB: getUserId(user => user.position === 'Legal Manager'), // David Harris
        connectionType: 'Weak Tie',
      },
    ];

    // Filter out any connections where a user couldn't be found
    const validConnections = connections.filter(conn => conn.userA && conn.userB);

    await Connection.insertMany(validConnections);

    console.log('Connections seeded successfully');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedConnections();
