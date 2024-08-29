const mongoose = require('mongoose');
const Connection = require('../models/connectionModel');
const User = require('../models/userModel');
const dotenv = require('dotenv');
const connectDB = require('../config/db');

dotenv.config();

connectDB();

const seedConnections = async () => {
  try {
    await Connection.deleteMany({});

    const users = await User.find({});

    const connections = [
      // Executive connections
      {
        userA: users[0]._id, // John Doe
        userB: users[1]._id, // Jane Smith (HR Manager)
        connectionType: 'Strong Tie',
      },
      {
        userA: users[0]._id, // John Doe
        userB: users[2]._id, // Alice Johnson (Finance Team Leader)
        connectionType: 'Strong Tie',
      },
      {
        userA: users[0]._id, // John Doe
        userB: users[8]._id, // George King (R&D Research Scientist)
        connectionType: 'Strong Tie',
      },
      {
        userA: users[0]._id, // John Doe
        userB: users[6]._id, // David Harris (Legal Advisor)
        connectionType: 'Strong Tie',
      },

      // Cross-department connections
      {
        userA: users[1]._id, // Jane Smith (HR Manager)
        userB: users[3]._id, // Bob Brown (Sales Employee)
        connectionType: 'Weak Tie',
      },
      {
        userA: users[2]._id, // Alice Johnson (Finance Team Leader)
        userB: users[4]._id, // Charlie Davis (Marketing Employee)
        connectionType: 'Weak Tie',
      },
      {
        userA: users[5]._id, // Emily Green (Operations Employee)
        userB: users[7]._id, // Fiona White (Product Manager)
        connectionType: 'Weak Tie',
      },
      {
        userA: users[8]._id, // George King (R&D Research Scientist)
        userB: users[9]._id, // Hannah Lee (Customer Support Specialist)
        connectionType: 'Weak Tie',
      },

      // Department-specific connections
      {
        userA: users[1]._id, // Jane Smith (HR Manager)
        userB: users[4]._id, // Charlie Davis (Marketing Employee)
        connectionType: 'Weak Tie',
      },
      {
        userA: users[3]._id, // Bob Brown (Sales Employee)
        userB: users[5]._id, // Emily Green (Operations Employee)
        connectionType: 'Weak Tie',
      },
      {
        userA: users[2]._id, // Alice Johnson (Finance Team Leader)
        userB: users[6]._id, // David Harris (Legal Advisor)
        connectionType: 'Weak Tie',
      },

      // Connections between similar roles
      {
        userA: users[0]._id, // John Doe (Executive)
        userB: users[7]._id, // Fiona White (Product Manager)
        connectionType: 'Strong Tie',
      },
      {
        userA: users[8]._id, // George King (R&D Research Scientist)
        userB: users[2]._id, // Alice Johnson (Finance Team Leader)
        connectionType: 'Strong Tie',
      },

      // Additional connections
      {
        userA: users[1]._id, // Jane Smith (HR Manager)
        userB: users[9]._id, // Hannah Lee (Customer Support Specialist)
        connectionType: 'Weak Tie',
      },
      {
        userA: users[4]._id, // Charlie Davis (Marketing Employee)
        userB: users[5]._id, // Emily Green (Operations Employee)
        connectionType: 'Weak Tie',
      },
      {
        userA: users[3]._id, // Bob Brown (Sales Employee)
        userB: users[6]._id, // David Harris (Legal Advisor)
        connectionType: 'Weak Tie',
      },
    ];

    await Connection.insertMany(connections);

    console.log('Connections seeded successfully');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedConnections();
