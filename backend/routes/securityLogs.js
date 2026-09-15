const express = require('express');
const router = express.Router();
const { getSecurityLogs } = require('../controllers/securityLogsController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(protect, authorize('admin'), getSecurityLogs);

module.exports = router;