const express = require('express');
const { 
  createCourse, 
  getAllCourses, 
  getCourseById, 
  getLessonById,
  enrollCourse, 
  uploadCourseMaterials,
  submitQuiz, 
  trackProgress, 
  issueCertificate, 
  postQuestion, 
  postAnswer, 
  upvoteAnswer,
  updateCourse,
} = require('../controllers/courseController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.get('/manage', protect, admin, getAllCourses);
router.post('/create', protect, admin, createCourse);
router.get('/', protect, getAllCourses);
router.get('/:id', protect, getCourseById);
router.post('/enroll/:id', protect, enrollCourse);
router.post('/quiz/submit', protect, submitQuiz);
router.get('/progress/:userId/:courseId', protect, trackProgress);
router.get('/certificate/:userId/:courseId', protect, issueCertificate);
router.post('/upload-materials/:id', protect, upload.array('materials', 10), uploadCourseMaterials);
router.get('/:courseId/module/:moduleId/section/:sectionId/lesson/:lessonId', protect, getLessonById);
router.post('/qa/post', protect, postQuestion);
router.post('/qa/answer', protect, postAnswer);
router.post('/qa/upvote', protect, upvoteAnswer);
router.put('/:id', protect, admin, updateCourse);

module.exports = router;
