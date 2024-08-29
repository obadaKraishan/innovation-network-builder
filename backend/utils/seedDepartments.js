const mongoose = require('mongoose');
const Department = require('../models/departmentModel');
const dotenv = require('dotenv');
const connectDB = require('../config/db');

// Load environment variables
dotenv.config({ path: './backend/.env' });
console.log('MONGO_URI:', process.env.MONGO_URI); // Debugging statement

// Connect to MongoDB
connectDB();

const seedDepartments = async () => {
  try {
    await Department.deleteMany({});

    // First, create all sub-departments as individual Department documents
    const subDepartmentsData = [
      { name: 'Software Development', manager: null },
      { name: 'Network Security', manager: null },
      { name: 'Technical Support', manager: null },
      { name: 'Data Analytics', manager: null },
      { name: 'DevOps', manager: null },
      { name: 'Recruitment', manager: null },
      { name: 'Employee Relations', manager: null },
      { name: 'Compensation and Benefits', manager: null },
      { name: 'Training and Development', manager: null },
      { name: 'Accounting', manager: null },
      { name: 'Payroll', manager: null },
      { name: 'Financial Planning', manager: null },
      { name: 'Internal Audit', manager: null },
      { name: 'Domestic Sales', manager: null },
      { name: 'International Sales', manager: null },
      { name: 'Sales Operations', manager: null },
      { name: 'Channel Sales', manager: null },
      { name: 'Digital Marketing', manager: null },
      { name: 'Market Research', manager: null },
      { name: 'Brand Management', manager: null },
      { name: 'Content Marketing', manager: null },
      { name: 'Logistics', manager: null },
      { name: 'Supply Chain Management', manager: null },
      { name: 'Facilities Management', manager: null },
      { name: 'Procurement', manager: null },
      { name: 'Corporate Law', manager: null },
      { name: 'Compliance', manager: null },
      { name: 'Intellectual Property', manager: null },
      { name: 'Contract Management', manager: null },
      { name: 'Product Innovation', manager: null },
      { name: 'Quality Assurance', manager: null },
      { name: 'Research Labs', manager: null },
      { name: 'Prototyping', manager: null },
      { name: 'Customer Service', manager: null },
      { name: 'Technical Support', manager: null },
      { name: 'Customer Success', manager: null },
      { name: 'Call Center Operations', manager: null },
      { name: 'Product Strategy', manager: null },
      { name: 'Product Design', manager: null },
      { name: 'Product Development', manager: null },
      { name: 'Product Marketing', manager: null },
    ];

    const createdSubDepartments = await Department.insertMany(subDepartmentsData);

    // Map of sub-departments by name for easy lookup
    const subDeptMap = createdSubDepartments.reduce((map, dept) => {
      map[dept.name] = dept._id;
      return map;
    }, {});

    // Now create parent departments and assign sub-departments
    const departments = [
      {
        name: 'IT',
        subDepartments: [
          subDeptMap['Software Development'],
          subDeptMap['Network Security'],
          subDeptMap['Technical Support'],
          subDeptMap['Data Analytics'],
          subDeptMap['DevOps'],
        ],
      },
      {
        name: 'HR',
        subDepartments: [
          subDeptMap['Recruitment'],
          subDeptMap['Employee Relations'],
          subDeptMap['Compensation and Benefits'],
          subDeptMap['Training and Development'],
        ],
      },
      {
        name: 'Finance',
        subDepartments: [
          subDeptMap['Accounting'],
          subDeptMap['Payroll'],
          subDeptMap['Financial Planning'],
          subDeptMap['Internal Audit'],
        ],
      },
      {
        name: 'Sales',
        subDepartments: [
          subDeptMap['Domestic Sales'],
          subDeptMap['International Sales'],
          subDeptMap['Sales Operations'],
          subDeptMap['Channel Sales'],
        ],
      },
      {
        name: 'Marketing',
        subDepartments: [
          subDeptMap['Digital Marketing'],
          subDeptMap['Market Research'],
          subDeptMap['Brand Management'],
          subDeptMap['Content Marketing'],
        ],
      },
      {
        name: 'Operations',
        subDepartments: [
          subDeptMap['Logistics'],
          subDeptMap['Supply Chain Management'],
          subDeptMap['Facilities Management'],
          subDeptMap['Procurement'],
        ],
      },
      {
        name: 'Legal',
        subDepartments: [
          subDeptMap['Corporate Law'],
          subDeptMap['Compliance'],
          subDeptMap['Intellectual Property'],
          subDeptMap['Contract Management'],
        ],
      },
      {
        name: 'Research and Development',
        subDepartments: [
          subDeptMap['Product Innovation'],
          subDeptMap['Quality Assurance'],
          subDeptMap['Research Labs'],
          subDeptMap['Prototyping'],
        ],
      },
      {
        name: 'Customer Support',
        subDepartments: [
          subDeptMap['Customer Service'],
          subDeptMap['Technical Support'],
          subDeptMap['Customer Success'],
          subDeptMap['Call Center Operations'],
        ],
      },
      {
        name: 'Product Management',
        subDepartments: [
          subDeptMap['Product Strategy'],
          subDeptMap['Product Design'],
          subDeptMap['Product Development'],
          subDeptMap['Product Marketing'],
        ],
      },
    ];

    await Department.insertMany(departments);

    console.log('Departments and sub-departments seeded successfully');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedDepartments();
