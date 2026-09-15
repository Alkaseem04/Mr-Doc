const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { reportUploaded, newUserRegistered } = require('../controllers/notificationsController');

// All routes below are protected
router.use(protect);

// Report uploaded notification
router.route('/report-uploaded')
  .post(reportUploaded);

// New user registered notification
router.route('/new-user')
  .post(newUserRegistered);

module.exports = router;