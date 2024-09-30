const mongoose = require('mongoose');
const { Course } = require('../models/courseModel'); // Adjust the path to match your project structure
const User = require('../models/userModel'); // Assuming the path is correct

const seedCourses = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/innovationNetworkBuilderBD', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Clear the existing collections if necessary
    await Course.deleteMany({});

    // Find a user to set as the course creator (you can use any user, like an admin or a specific role)
    const creatorUser = await User.findOne({ email: 'robert.ceo@example.com' }); // Adjust email to match an actual user

    if (!creatorUser) {
      throw new Error('No user found to assign as creator. Make sure there are users in the database.');
    }

    // Seed two sample courses
    const courses = [
      {
        title: 'Introduction to React',
        description: 'A complete guide to getting started with React.js and its ecosystem.',
        creatorId: creatorUser._id, // Assign the creatorId
        modules: [
          {
            moduleTitle: 'Getting Started with React',
            sections: [
              {
                sectionTitle: 'Introduction',
                lessons: [
                  {
                    lessonTitle: 'What is React?',
                    lessonText: 'React is a popular JavaScript library for building user interfaces.',
                    materials: [
                      {
                        materialType: 'video',
                        materialUrl: 'https://example.com/intro-to-react-video',
                        title: 'Introduction Video',
                        description: 'A brief introduction to React.js and its core concepts.',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
        skillsGained: ['React Basics', 'Component-Based Design', 'State Management'],
        courseRequirements: ['Basic JavaScript knowledge'],
        objectives: 'By the end of this course, you will be able to build basic web applications using React.',
      },
      {
        title: 'Advanced Node.js Development',
        description: 'A comprehensive course on advanced Node.js topics and backend development.',
        creatorId: creatorUser._id, // Assign the creatorId
        modules: [
          {
            moduleTitle: 'Advanced JavaScript in Node.js',
            sections: [
              {
                sectionTitle: 'Async Programming',
                lessons: [
                  {
                    lessonTitle: 'Callbacks and Promises',
                    lessonText: 'This lesson covers how to handle asynchronous operations in Node.js using callbacks and promises.',
                    materials: [
                      {
                        materialType: 'video',
                        materialUrl: 'https://example.com/node-async-video',
                        title: 'Asynchronous Programming in Node.js',
                        description: 'An overview of async programming in Node.js.',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
        skillsGained: ['Advanced JavaScript', 'Backend Development', 'REST APIs'],
        courseRequirements: ['Basic knowledge of Node.js and Express.js'],
        objectives: 'By the end of this course, you will be able to build and maintain advanced Node.js applications.',
      },
    ];

    await Course.insertMany(courses);
    console.log('Courses seeded successfully!');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding courses:', error);
    mongoose.connection.close();
  }
};

seedCourses();
