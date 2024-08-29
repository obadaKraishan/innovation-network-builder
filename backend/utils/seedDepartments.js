const mongoose = require('mongoose');
const Department = require('../models/departmentModel');
const dotenv = require('dotenv');
const connectDB = require('../config/db');

dotenv.config();

connectDB();

const seedDepartments = async () => {
  try {
    await Department.deleteMany({});

    const departments = [
      {
        name: 'IT',
        subDepartments: [],
      },
      {
        name: 'HR',
        subDepartments: [],
      },
      {
        name: 'Finance',
        subDepartments: [],
      },
      {
        name: 'Sales',
        subDepartments: [],
      },
      {
        name: 'Marketing',
        subDepartments: [],
      },
      {
        name: 'Operations',
        subDepartments: [],
      },
      {
        name: 'Legal',
        subDepartments: [],
      },
      {
        name: 'Research and Development',
        subDepartments: [],
      },
      {
        name: 'Customer Support',
        subDepartments: [],
      },
      {
        name: 'Product Management',
        subDepartments: [],
      },
    ];

    const createdDepartments = await Department.insertMany(departments);

    // Adding sub-departments
    const itSubDepartments = [
      { name: 'Software Development', manager: null },
      { name: 'Network Security', manager: null },
      { name: 'Technical Support', manager: null },
      { name: 'Data Analytics', manager: null },
      { name: 'DevOps', manager: null },
    ];

    const hrSubDepartments = [
      { name: 'Recruitment', manager: null },
      { name: 'Employee Relations', manager: null },
      { name: 'Compensation and Benefits', manager: null },
      { name: 'Training and Development', manager: null },
    ];

    const financeSubDepartments = [
      { name: 'Accounting', manager: null },
      { name: 'Payroll', manager: null },
      { name: 'Financial Planning', manager: null },
      { name: 'Internal Audit', manager: null },
    ];

    const salesSubDepartments = [
      { name: 'Domestic Sales', manager: null },
      { name: 'International Sales', manager: null },
      { name: 'Sales Operations', manager: null },
      { name: 'Channel Sales', manager: null },
    ];

    const marketingSubDepartments = [
      { name: 'Digital Marketing', manager: null },
      { name: 'Market Research', manager: null },
      { name: 'Brand Management', manager: null },
      { name: 'Content Marketing', manager: null },
    ];

    const operationsSubDepartments = [
      { name: 'Logistics', manager: null },
      { name: 'Supply Chain Management', manager: null },
      { name: 'Facilities Management', manager: null },
      { name: 'Procurement', manager: null },
    ];

    const legalSubDepartments = [
      { name: 'Corporate Law', manager: null },
      { name: 'Compliance', manager: null },
      { name: 'Intellectual Property', manager: null },
      { name: 'Contract Management', manager: null },
    ];

    const rndSubDepartments = [
      { name: 'Product Innovation', manager: null },
      { name: 'Quality Assurance', manager: null },
      { name: 'Research Labs', manager: null },
      { name: 'Prototyping', manager: null },
    ];

    const customerSupportSubDepartments = [
      { name: 'Customer Service', manager: null },
      { name: 'Technical Support', manager: null },
      { name: 'Customer Success', manager: null },
      { name: 'Call Center Operations', manager: null },
    ];

    const productManagementSubDepartments = [
      { name: 'Product Strategy', manager: null },
      { name: 'Product Design', manager: null },
      { name: 'Product Development', manager: null },
      { name: 'Product Marketing', manager: null },
    ];

    const allSubDepartments = [
      ...itSubDepartments,
      ...hrSubDepartments,
      ...financeSubDepartments,
      ...salesSubDepartments,
      ...marketingSubDepartments,
      ...operationsSubDepartments,
      ...legalSubDepartments,
      ...rndSubDepartments,
      ...customerSupportSubDepartments,
      ...productManagementSubDepartments,
    ];

    for (const subDept of allSubDepartments) {
      const parentDept = createdDepartments.find(dept => {
        return subDept.name.includes(dept.name) || dept.name === 'IT';
      });
      parentDept.subDepartments.push(subDept);
      await Department.findByIdAndUpdate(parentDept._id, parentDept);
    }

    console.log('Departments and sub-departments seeded successfully');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedDepartments();
