const mongoose = require('mongoose');
const User = require('../models/userModel');
const Department = require('../models/departmentModel');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const bcrypt = require('bcryptjs');

dotenv.config();

connectDB();

const seedUsers = async () => {
  try {
    await User.deleteMany({});

    const departments = await Department.find({}).populate('subDepartments');

    const users = [
      {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'Executive',
        department: departments.find(dept => dept.name === 'IT')._id,
      },
      {
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'Department Manager',
        department: departments.find(dept => dept.name === 'HR')._id,
      },
      {
        name: 'Alice Johnson',
        email: 'alice.johnson@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'Team Leader',
        department: departments.find(dept => dept.name === 'Finance')._id,
      },
      {
        name: 'Bob Brown',
        email: 'bob.brown@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'Employee',
        department: departments.find(dept => dept.name === 'Sales')._id,
      },
      {
        name: 'Charlie Davis',
        email: 'charlie.davis@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'Employee',
        department: departments.find(dept => dept.name === 'Marketing')._id,
      },
      {
        name: 'Emily Green',
        email: 'emily.green@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'Employee',
        department: departments.find(dept => dept.name === 'Operations')._id,
      },
      {
        name: 'David Harris',
        email: 'david.harris@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'Legal Advisor',
        department: departments.find(dept => dept.name === 'Legal')._id,
      },
      {
        name: 'Fiona White',
        email: 'fiona.white@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'Product Manager',
        department: departments.find(dept => dept.name === 'Product Management')._id,
      },
      {
        name: 'George King',
        email: 'george.king@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'Research Scientist',
        department: departments.find(dept => dept.name === 'Research and Development')._id,
      },
      {
        name: 'Hannah Lee',
        email: 'hannah.lee@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'Customer Support Specialist',
        department: departments.find(dept => dept.name === 'Customer Support')._id,
      },
    ];

    await User.insertMany(users);

    console.log('Users seeded successfully');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedUsers();
