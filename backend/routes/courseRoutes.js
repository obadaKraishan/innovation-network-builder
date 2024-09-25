const express = require('express');
const { createCourse, getAllCourses, getCourseById, enrollCourse, submitQuiz, postQuestion } = require('../controllers/courseController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/create', protect, admin, createCourse);
router.get('/', protect, getAllCourses);
router.get('/:id', protect, getCourseById);
router.post('/enroll/:id', protect, enrollCourse);
router.post('/quiz/submit', protect, submitQuiz);
router.post('/qa/post', protect, postQuestion);

module.exports = router;
