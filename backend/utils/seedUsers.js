const mongoose = require('mongoose');
const User = require('../models/userModel');
const Department = require('../models/departmentModel');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const bcrypt = require('bcryptjs');

// Load environment variables manually
dotenv.config({ path: './.env' });

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
        skills: ['Leadership', 'Strategic Planning', 'Innovation'],
      },
      {
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'Department Manager',
        department: departments.find(dept => dept.name === 'HR')._id,
        skills: ['Employee Relations', 'Recruitment', 'Training'],
      },
      {
        name: 'Alice Johnson',
        email: 'alice.johnson@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'Team Leader',
        department: departments.find(dept => dept.name === 'Finance')._id,
        skills: ['Financial Analysis', 'Budgeting', 'Risk Management'],
      },
      {
        name: 'Bob Brown',
        email: 'bob.brown@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'Employee',
        department: departments.find(dept => dept.name === 'Sales')._id,
        skills: ['Sales', 'Customer Service', 'Negotiation'],
      },
      {
        name: 'Charlie Davis',
        email: 'charlie.davis@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'Employee',
        department: departments.find(dept => dept.name === 'Marketing')._id,
        skills: ['Digital Marketing', 'Content Creation', 'SEO'],
      },
      {
        name: 'Emily Green',
        email: 'emily.green@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'Employee',
        department: departments.find(dept => dept.name === 'Operations')._id,
        skills: ['Operations Management', 'Process Improvement', 'Supply Chain'],
      },
      {
        name: 'David Harris',
        email: 'david.harris@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'Department Manager',
        department: departments.find(dept => dept.name === 'Legal')._id,
        skills: ['Contract Negotiation', 'Compliance', 'Litigation'],
      },
      {
        name: 'Fiona White',
        email: 'fiona.white@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'Team Leader',
        department: departments.find(dept => dept.name === 'Product Management')._id,
        skills: ['Product Development', 'Project Management', 'Market Research'],
      },
      {
        name: 'George King',
        email: 'george.king@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'Research Scientist',
        department: departments.find(dept => dept.name === 'Research and Development')._id,
        skills: ['Research', 'Data Analysis', 'Scientific Writing'],
      },
      {
        name: 'Hannah Lee',
        email: 'hannah.lee@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'Customer Support Specialist',
        department: departments.find(dept => dept.name === 'Customer Support')._id,
        skills: ['Customer Service', 'Problem Solving', 'Communication'],
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
