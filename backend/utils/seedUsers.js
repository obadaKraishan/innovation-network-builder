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
      // Executive Team
      {
        name: 'Robert CEO',
        email: 'robert.ceo@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'CEO',
        department: null, // CEO oversees the entire company
        skills: ['Leadership', 'Strategic Vision', 'Innovation'],
        position: 'Chief Executive Officer',
      },
      {
        name: 'Linda Brown',
        email: 'linda.brown@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'CTO',
        department: departments.find(dept => dept.name === 'IT')._id,
        skills: ['Technology Strategy', 'Innovation', 'Team Leadership'],
        position: 'Chief Technology Officer',
      },
      {
        name: 'James Director',
        email: 'james.director@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'Director of HR',
        department: departments.find(dept => dept.name === 'HR')._id,
        skills: ['Employee Relations', 'Talent Management', 'Organizational Development'],
        position: 'Human Resources Director',
      },
      {
        name: 'Alice Johnson',
        email: 'alice.finance@example.com', // Changed email to ensure uniqueness
        password: await bcrypt.hash('password123', 10),
        role: 'Director of Finance',
        department: departments.find(dept => dept.name === 'Finance')._id,
        skills: ['Financial Planning', 'Risk Management', 'Budgeting'],
        position: 'Finance Director',
      },

      // IT Department
      {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'Department Manager',
        department: departments.find(dept => dept.subDepartments.some(subDept => subDept.name === 'Software Development'))._id,
        skills: ['Software Development', 'Project Management', 'Agile'],
        position: 'Software Development Manager',
      },
      {
        name: 'Sara Williams',
        email: 'sara.williams@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'Team Leader',
        department: departments.find(dept => dept.subDepartments.some(subDept => subDept.name === 'Network Security'))._id,
        skills: ['Network Security', 'Cybersecurity', 'Firewall Management'],
        position: 'Network Security Team Lead',
      },
      {
        name: 'Robert Brown',
        email: 'robert.brown@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'Employee',
        department: departments.find(dept => dept.subDepartments.some(subDept => subDept.name === 'DevOps'))._id,
        skills: ['DevOps', 'CI/CD', 'Automation'],
        position: 'DevOps Engineer',
      },
      {
        name: 'Emily Johnson',
        email: 'emily.qa@example.com', // Changed email to ensure uniqueness
        password: await bcrypt.hash('password123', 10),
        role: 'Employee',
        department: departments.find(dept => dept.subDepartments.some(subDept => subDept.name === 'Quality Assurance'))._id,
        skills: ['Testing', 'Automation', 'Quality Assurance'],
        position: 'QA Engineer',
      },
      {
        name: 'Michael Green',
        email: 'michael.green@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'Employee',
        department: departments.find(dept => dept.subDepartments.some(subDept => subDept.name === 'Software Development'))._id,
        skills: ['Frontend Development', 'React.js', 'JavaScript'],
        position: 'Frontend Developer',
      },
      {
        name: 'David White',
        email: 'david.white@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'Employee',
        department: departments.find(dept => dept.subDepartments.some(subDept => subDept.name === 'Software Development'))._id,
        skills: ['Backend Development', 'Node.js', 'APIs'],
        position: 'Backend Developer',
      },

      // HR Department
      {
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'Department Manager',
        department: departments.find(dept => dept.name === 'HR')._id,
        skills: ['Employee Relations', 'Recruitment', 'Training'],
        position: 'HR Manager',
      },
      {
        name: 'Laura Adams',
        email: 'laura.adams@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'Team Leader',
        department: departments.find(dept => dept.subDepartments.some(subDept => subDept.name === 'Recruitment'))._id,
        skills: ['Recruitment', 'Talent Acquisition', 'Onboarding'],
        position: 'Recruitment Lead',
      },
      {
        name: 'Mark Johnson',
        email: 'mark.johnson@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'Employee',
        department: departments.find(dept => dept.subDepartments.some(subDept => subDept.name === 'Compensation and Benefits'))._id,
        skills: ['Compensation', 'Benefits Management', 'Payroll'],
        position: 'Compensation Specialist',
      },

      // Finance Department
      {
        name: 'Alice Johnson',
        email: 'alice.analyst@example.com', // Changed email to ensure uniqueness
        password: await bcrypt.hash('password123', 10),
        role: 'Team Leader',
        department: departments.find(dept => dept.name === 'Finance')._id,
        skills: ['Financial Analysis', 'Budgeting', 'Risk Management'],
        position: 'Financial Analyst Lead',
      },
      {
        name: 'David Clark',
        email: 'david.clark@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'Employee',
        department: departments.find(dept => dept.subDepartments.some(subDept => subDept.name === 'Payroll'))._id,
        skills: ['Payroll', 'Accounting', 'Compliance'],
        position: 'Payroll Specialist',
      },

      // Sales Department
      {
        name: 'Bob Brown',
        email: 'bob.brown@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'Employee',
        department: departments.find(dept => dept.name === 'Sales')._id,
        skills: ['Sales', 'Customer Service', 'Negotiation'],
        position: 'Sales Representative',
      },
      {
        name: 'Rachel Green',
        email: 'rachel.green@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'Employee',
        department: departments.find(dept => dept.subDepartments.some(subDept => subDept.name === 'International Sales'))._id,
        skills: ['International Sales', 'Market Expansion', 'Customer Relations'],
        position: 'International Sales Specialist',
      },

      // Marketing Department
      {
        name: 'Charlie Davis',
        email: 'charlie.davis@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'Employee',
        department: departments.find(dept => dept.name === 'Marketing')._id,
        skills: ['Digital Marketing', 'Content Creation', 'SEO'],
        position: 'Digital Marketing Specialist',
      },
      {
        name: 'Emma Wilson',
        email: 'emma.wilson@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'Team Leader',
        department: departments.find(dept => dept.subDepartments.some(subDept => subDept.name === 'Market Research'))._id,
        skills: ['Market Research', 'Consumer Behavior', 'Analytics'],
        position: 'Market Research Lead',
      },

      // Operations Department
      {
        name: 'Emily Green',
        email: 'emily.green@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'Employee',
        department: departments.find(dept => dept.name === 'Operations')._id,
        skills: ['Operations Management', 'Process Improvement', 'Supply Chain'],
        position: 'Operations Specialist',
      },

      // Legal Department
      {
        name: 'David Harris',
        email: 'david.harris@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'Department Manager',
        department: departments.find(dept => dept.name === 'Legal')._id,
        skills: ['Contract Negotiation', 'Compliance', 'Litigation'],
        position: 'Legal Manager',
      },
      {
        name: 'Sophia White',
        email: 'sophia.white@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'Employee',
        department: departments.find(dept => dept.subDepartments.some(subDept => subDept.name === 'Corporate Law'))._id,
        skills: ['Corporate Law', 'Legal Writing', 'Mergers & Acquisitions'],
        position: 'Corporate Lawyer',
      },

      // Research and Development (R&D) Department
      {
        name: 'George King',
        email: 'george.king@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'Research Scientist',
        department: departments.find(dept => dept.name === 'Research and Development')._id,
        skills: ['Research', 'Data Analysis', 'Scientific Writing'],
        position: 'Research Scientist',
      },

      // Customer Support Department
      {
        name: 'Hannah Lee',
        email: 'hannah.lee@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'Customer Support Specialist',
        department: departments.find(dept => dept.name === 'Customer Support')._id,
        skills: ['Customer Service', 'Problem Solving', 'Communication'],
        position: 'Customer Support Specialist',
      },
      {
        name: 'Michael Brown',
        email: 'michael.brown@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'Employee',
        department: departments.find(dept => dept.subDepartments.some(subDept => subDept.name === 'Call Center Operations'))._id,
        skills: ['Call Center Management', 'Customer Relations', 'Team Leadership'],
        position: 'Call Center Operations Specialist',
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
