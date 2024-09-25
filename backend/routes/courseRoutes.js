const express = require('express');
const { 
  createCourse, 
  getAllCourses, 
  getCourseById, 
  enrollCourse, 
  submitQuiz, 
  trackProgress, 
  issueCertificate, 
  postQuestion, 
  postAnswer, 
  upvoteAnswer
} = require('../controllers/courseController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/manage', protect, admin, getAllCourses);
router.post('/create', protect, admin, createCourse);
router.get('/', protect, getAllCourses);
router.get('/:id', protect, getCourseById);
router.post('/enroll/:id', protect, enrollCourse);
router.post('/quiz/submit', protect, submitQuiz);
router.get('/progress/:userId/:courseId', protect, trackProgress);
router.get('/certificate/:userId/:courseId', protect, issueCertificate);
router.post('/qa/post', protect, postQuestion);
router.post('/qa/answer', protect, postAnswer);
router.post('/qa/upvote', protect, upvoteAnswer);

module.exports = router;
