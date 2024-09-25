const mongoose = require('mongoose');
const Course = require('../models/courseModel');
const User = require('../models/userModel');
const connectDB = require('../config/db');

connectDB();

const seedCourses = async () => {
  try {
    const creator = await User.findOne({ role: 'CEO' }); // Find a user with a higher role to assign as creator

    if (!creator) {
      throw new Error('No user found with the role of CEO. Please create a user with that role.');
    }

    const courses = [
      {
        title: 'Introduction to Machine Learning',
        description: 'A beginner course in Machine Learning covering fundamental concepts, algorithms, and real-world applications.',
        image: 'https://example.com/ml-course-image.jpg',
        creatorId: creator._id,
        modules: [
          {
            moduleTitle: 'Introduction to ML',
            sections: [
              {
                sectionTitle: 'What is Machine Learning?',
                lessons: [
                  {
                    lessonTitle: 'Introduction to Machine Learning',
                    lessonType: 'video',
                    videoUrl: 'https://example.com/intro-ml.mp4',
                  },
                  {
                    lessonTitle: 'History of ML',
                    lessonType: 'text',
                    textContent: 'Machine learning is a subfield of artificial intelligence...',
                  },
                ],
              },
              {
                sectionTitle: 'Types of Machine Learning',
                lessons: [
                  {
                    lessonTitle: 'Supervised Learning',
                    lessonType: 'text',
                    textContent: 'In supervised learning, the model is trained on labeled data...',
                  },
                  {
                    lessonTitle: 'Unsupervised Learning',
                    lessonType: 'text',
                    textContent: 'In unsupervised learning, the model works with unlabeled data...',
                  },
                ],
                quiz: [
                  {
                    questionText: 'What is supervised learning?',
                    choices: [
                      'Learning with labeled data',
                      'Learning with unlabeled data',
                      'Learning with rewards',
                    ],
                    correctAnswer: 'Learning with labeled data',
                  },
                ],
              },
            ],
          },
          {
            moduleTitle: 'Applications of ML',
            sections: [
              {
                sectionTitle: 'Real-World Applications',
                lessons: [
                  {
                    lessonTitle: 'ML in Healthcare',
                    lessonType: 'video',
                    videoUrl: 'https://example.com/ml-healthcare.mp4',
                  },
                  {
                    lessonTitle: 'ML in Finance',
                    lessonType: 'text',
                    textContent: 'Machine learning plays a significant role in the finance industry...',
                  },
                ],
              },
            ],
          },
        ],
        estimatedDuration: 10,
        skillsGained: ['Machine Learning', 'Python', 'Supervised Learning', 'Unsupervised Learning'],
        courseRequirements: ['Basic Python knowledge'],
        objectives: 'To provide students with a fundamental understanding of machine learning.',
        isMandatory: false,
        certificateIssued: false,
      },
      {
        title: 'Data Science for Beginners',
        description: 'A comprehensive course that introduces data science concepts, Python programming, and data analysis.',
        image: 'https://example.com/ds-course-image.jpg',
        creatorId: creator._id,
        modules: [
          {
            moduleTitle: 'Introduction to Data Science',
            sections: [
              {
                sectionTitle: 'What is Data Science?',
                lessons: [
                  {
                    lessonTitle: 'Data Science Overview',
                    lessonType: 'video',
                    videoUrl: 'https://example.com/data-science-overview.mp4',
                  },
                  {
                    lessonTitle: 'Data Science Tools',
                    lessonType: 'text',
                    textContent: 'In this section, we will discuss the essential tools for data science...',
                  },
                ],
              },
            ],
          },
          {
            moduleTitle: 'Python for Data Science',
            sections: [
              {
                sectionTitle: 'Python Basics',
                lessons: [
                  {
                    lessonTitle: 'Introduction to Python',
                    lessonType: 'text',
                    textContent: 'Python is a versatile programming language used in various domains...',
                  },
                ],
              },
            ],
          },
        ],
        estimatedDuration: 8,
        skillsGained: ['Python', 'Data Analysis', 'Data Science'],
        courseRequirements: ['No prior experience required'],
        objectives: 'To introduce students to data science and Python programming.',
        isMandatory: true,
        certificateIssued: true,
      },
    ];

    await Course.deleteMany(); // Clear the existing courses
    await Course.insertMany(courses); // Insert the new courses

    console.log('Courses seeded successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding courses:', error);
    process.exit(1);
  }
};

seedCourses();
