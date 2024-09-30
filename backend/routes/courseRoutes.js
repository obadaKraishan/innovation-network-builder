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
  updateCourse,
  createQuiz,  
  getQuizzesByLesson, 
  assignQuizToLesson,
  getAllQuizzes,
  getQuizById,
  updateQuiz,
  deleteQuiz, 
} = require('../controllers/courseController');
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

// Quiz Routes (now handled by courseController)
router.get('/quizzes', protect, getAllQuizzes); 
router.get('/quizzes/:id', protect, getQuizById); // Get quiz details
router.post('/quizzes/create', protect, admin, (req, res, next) => {
  console.log("POST request received on /api/courses/quizzes/create with data:", req.body); // Log the incoming request
  next(); // Pass to the controller
}, createQuiz);
router.get('/quizzes/lesson/:lessonId', protect, getQuizzesByLesson); 
router.post('/quizzes/assign', protect, admin, assignQuizToLesson);  
router.put('/quizzes/:id', protect, admin, updateQuiz); // Update quiz
router.delete('/quizzes/:id', protect, admin, deleteQuiz); // Delete quiz

module.exports = router;
