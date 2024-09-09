const express = require('express');
const {
  createSurvey,
  getAllSurveys, 
  getSurveyById, 
  updateSurvey, 
  deleteSurvey,
  submitFeedback,
  getFeedbackById,
  getAnonymousFeedback,
  getNonAnonymousFeedback,
  getUserFeedback,
  getWellnessResources,
  getDashboardMetrics,
} = require('../controllers/WellnessController');
const {
    createResource,
    getAllResources,
    getWellnessResourceById,
    deleteResource,
} = require('../controllers/WellnessResourceController');
const {
    createRecommendation,
    getUserRecommendations,
} = require('../controllers/PersonalizedRecommendationController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/create-survey').post(protect, admin, createSurvey);
router.route('/create-survey').post(protect, admin, createSurvey);
router.route('/surveys/:surveyId').get(protect, getSurveyById).put(protect, admin, updateSurvey).delete(protect, admin, deleteSurvey);
router.route('/all-surveys').get(protect, admin, getAllSurveys);
router.route('/submit-feedback').post(protect, submitFeedback);
router.route('/feedback/:feedbackId').get(protect, getFeedbackById);
router.route('/anonymous-feedback').get(protect, admin, getAnonymousFeedback);
router.route('/non-anonymous-feedback').get(protect, admin, getNonAnonymousFeedback); // Non-anonymous feedback for managers
router.route('/user-feedback/:userId').get(protect, getUserFeedback); // User-specific feedback
router.route('/metrics').get(protect, admin, getDashboardMetrics);
// Resources routes
router.route('/resources').get(protect, getAllResources).post(protect, admin, createResource);
router.route('/resources/:resourceId').get(protect, getWellnessResourceById).delete(protect, admin, deleteResource);

// Personalized Recommendations routes
router.route('/recommendations/:userId').get(protect, getUserRecommendations);
router.route('/recommendations').post(protect, admin, createRecommendation);

module.exports = router;
