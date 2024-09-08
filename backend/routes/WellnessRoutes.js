const express = require('express');
const {
  createSurvey,
  submitFeedback,
  getAnonymousFeedback,
  getWellnessResources,
  getDashboardMetrics,
} = require('../controllers/WellnessController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/create-survey').post(protect, admin, createSurvey);
router.route('/submit-feedback').post(protect, submitFeedback);
router.route('/anonymous-feedback').get(protect, admin, getAnonymousFeedback);
router.route('/resources').get(protect, getWellnessResources);
router.route('/metrics').get(protect, admin, getDashboardMetrics);

module.exports = router;
