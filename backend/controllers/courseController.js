const Course = require('../models/courseModel');

// Create a new course
const createCourse = async (req, res) => {
  try {
    const newCourse = new Course(req.body);
    const savedCourse = await newCourse.save();
    res.status(201).json(savedCourse);
  } catch (error) {
    res.status(400).json({ message: 'Error creating course', error });
  }
};

// Fetch all courses
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate('creatorId', 'name');
    res.json(courses);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching courses', error });
  }
};

// Fetch course details
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('creatorId', 'name');
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching course details', error });
  }
};

// Enroll in a course
const enrollCourse = async (req, res) => {
  // Add logic to track enrolled courses for users
};

// Submit quiz answers
const submitQuiz = async (req, res) => {
  // Add logic for submitting quiz answers and calculating scores
};

// Post a Q&A question
const postQuestion = async (req, res) => {
  const { courseId, questionText } = req.body;
  try {
    const course = await Course.findById(courseId);
    course.qa.push({ questionText });
    await course.save();
    res.status(201).json({ message: 'Question posted' });
  } catch (error) {
    res.status(400).json({ message: 'Error posting question', error });
  }
};

module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  enrollCourse,
  submitQuiz,
  postQuestion,
};
