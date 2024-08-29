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

    // First, create all main departments
    const mainDepartmentsData = [
      { name: 'IT' },
      { name: 'HR' },
      { name: 'Finance' },
      { name: 'Sales' },
      { name: 'Marketing' },
      { name: 'Operations' },
      { name: 'Legal' },
      { name: 'Research and Development' },
      { name: 'Customer Support' },
      { name: 'Product Management' },
    ];

    const createdMainDepartments = await Department.insertMany(mainDepartmentsData);

    // Map of main departments by name for easy lookup
    const mainDeptMap = createdMainDepartments.reduce((map, dept) => {
      map[dept.name] = dept._id;
      return map;
    }, {});

    // Create sub-departments and assign them to their respective main department
    const subDepartmentsData = [
      { name: 'Software Development', parentDepartment: mainDeptMap['IT'] },
      { name: 'Network Security', parentDepartment: mainDeptMap['IT'] },
      { name: 'Technical Support', parentDepartment: mainDeptMap['IT'] },
      { name: 'Data Analytics', parentDepartment: mainDeptMap['IT'] },
      { name: 'DevOps', parentDepartment: mainDeptMap['IT'] },
      { name: 'Recruitment', parentDepartment: mainDeptMap['HR'] },
      { name: 'Employee Relations', parentDepartment: mainDeptMap['HR'] },
      { name: 'Compensation and Benefits', parentDepartment: mainDeptMap['HR'] },
      { name: 'Training and Development', parentDepartment: mainDeptMap['HR'] },
      { name: 'Accounting', parentDepartment: mainDeptMap['Finance'] },
      { name: 'Payroll', parentDepartment: mainDeptMap['Finance'] },
      { name: 'Financial Planning', parentDepartment: mainDeptMap['Finance'] },
      { name: 'Internal Audit', parentDepartment: mainDeptMap['Finance'] },
      { name: 'Domestic Sales', parentDepartment: mainDeptMap['Sales'] },
      { name: 'International Sales', parentDepartment: mainDeptMap['Sales'] },
      { name: 'Sales Operations', parentDepartment: mainDeptMap['Sales'] },
      { name: 'Channel Sales', parentDepartment: mainDeptMap['Sales'] },
      { name: 'Digital Marketing', parentDepartment: mainDeptMap['Marketing'] },
      { name: 'Market Research', parentDepartment: mainDeptMap['Marketing'] },
      { name: 'Brand Management', parentDepartment: mainDeptMap['Marketing'] },
      { name: 'Content Marketing', parentDepartment: mainDeptMap['Marketing'] },
      { name: 'Logistics', parentDepartment: mainDeptMap['Operations'] },
      { name: 'Supply Chain Management', parentDepartment: mainDeptMap['Operations'] },
      { name: 'Facilities Management', parentDepartment: mainDeptMap['Operations'] },
      { name: 'Procurement', parentDepartment: mainDeptMap['Operations'] },
      { name: 'Corporate Law', parentDepartment: mainDeptMap['Legal'] },
      { name: 'Compliance', parentDepartment: mainDeptMap['Legal'] },
      { name: 'Intellectual Property', parentDepartment: mainDeptMap['Legal'] },
      { name: 'Contract Management', parentDepartment: mainDeptMap['Legal'] },
      { name: 'Product Innovation', parentDepartment: mainDeptMap['Research and Development'] },
      { name: 'Quality Assurance', parentDepartment: mainDeptMap['Research and Development'] },
      { name: 'Research Labs', parentDepartment: mainDeptMap['Research and Development'] },
      { name: 'Prototyping', parentDepartment: mainDeptMap['Research and Development'] },
      { name: 'Customer Service', parentDepartment: mainDeptMap['Customer Support'] },
      { name: 'Technical Support', parentDepartment: mainDeptMap['Customer Support'] },
      { name: 'Customer Success', parentDepartment: mainDeptMap['Customer Support'] },
      { name: 'Call Center Operations', parentDepartment: mainDeptMap['Customer Support'] },
      { name: 'Product Strategy', parentDepartment: mainDeptMap['Product Management'] },
      { name: 'Product Design', parentDepartment: mainDeptMap['Product Management'] },
      { name: 'Product Development', parentDepartment: mainDeptMap['Product Management'] },
      { name: 'Product Marketing', parentDepartment: mainDeptMap['Product Management'] },
    ];

    await Department.insertMany(subDepartmentsData);

    console.log('Main departments and their sub-departments seeded successfully');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedDepartments();
