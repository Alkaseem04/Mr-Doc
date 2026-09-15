const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { 
  getReports, 
  getReportById, 
  uploadReport, 
  updateReport, 
  deleteReport,
  viewReport,
  downloadReport,
  getAllReportsAdmin
} = require('../controllers/reportsController');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/reports/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Create uploads directory if it doesn't exist
const fs = require('fs');
const uploadDir = path.join(__dirname, '../uploads/reports');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// All routes below are protected
router.use(protect);

// Get all reports for logged in user
router.route('/')
  .get(getReports)
  .post(upload.single('report'), uploadReport);

// Get all reports for admin
router.route('/admin/all')
  .get(authorize('admin'), getAllReportsAdmin);

// Get single report, update or delete
router.route('/:id')
  .get(getReportById)
  .put(updateReport)
  .delete(deleteReport);

// View and download reports
router.route('/:id/view')
  .get(viewReport);
  
router.route('/:id/download')
  .get(downloadReport);

module.exports = router;