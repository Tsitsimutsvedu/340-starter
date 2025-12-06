const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');

router.get('/new', feedbackController.feedbackForm);
router.post('/new', feedbackController.submitFeedback);
router.get('/manage', feedbackController.viewFeedback);

module.exports = router;
