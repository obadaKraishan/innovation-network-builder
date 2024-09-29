const express = require('express');
const {
  createCourse,
  getAllCourses,
  getCourseById,
  getLessonById,
  enrollCourse,
  uploadCourseMaterials,
  deleteMaterial,
  submitQuiz,
  trackProgress,
  issueCertificate,
  postQuestion,
  postAnswer,
  upvoteAnswer,
  updateCourse
} = require('../controllers/courseController');
const { 
  createQuiz, 
  getQuizzesByLesson, 
  assignQuizToLesson 
} = require('../controllers/quizController');  // Import quiz controller
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// Course Routes
router.get('/manage', protect, admin, getAllCourses);
router.post('/create', protect, admin, createCourse);
router.get('/', protect, getAllCourses);
router.get('/:id', protect, getCourseById);
router.post('/enroll/:id', protect, enrollCourse);
router.post('/quiz/submit', protect, submitQuiz);
router.get('/progress/:userId/:courseId', protect, trackProgress);
router.get('/certificate/:userId/:courseId', protect, issueCertificate);
router.post('/upload-materials/:id', protect, upload.array('materials', 10), uploadCourseMaterials);
router.delete('/:id/materials/:materialId', protect, admin, deleteMaterial);
router.get('/:courseId/module/:moduleId/section/:sectionId/lesson/:lessonId', protect, getLessonById);
router.post('/qa/post', protect, postQuestion);
router.post('/qa/answer', protect, postAnswer);
router.post('/qa/upvote', protect, upvoteAnswer);
router.put('/:id', protect, admin, updateCourse);

// Quiz Routes
router.post('/quizzes/create', protect, admin, createQuiz);  // Create Quiz
router.get('/quizzes/lesson/:lessonId', protect, getQuizzesByLesson);  // Get quizzes by lesson
router.post('/quizzes/assign', protect, admin, assignQuizToLesson);  // Assign quiz to lesson

module.exports = router;
