const Report = require('../models/Report');
const User = require('../models/User');
const path = require('path');
const fs = require('fs').promises;

// @desc    Get all reports for a patient
// @route   GET /api/reports
// @access  Private
const getReports = async (req, res) => {
  try {
    const reports = await Report.find({ patient: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get report by ID
// @route   GET /api/reports/:id
// @access  Private
const getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    
    // Check if user is authorized to access this report
    if (report.patient.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to access this report' });
    }
    
    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upload a new report
// @route   POST /api/reports
// @access  Private
const uploadReport = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }
    
    // Validate file type
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(req.file.mimetype)) {
      // Delete uploaded file
      await fs.unlink(req.file.path);
      return res.status(400).json({ message: 'Invalid file type. Only PDF, PNG, JPG files are allowed.' });
    }
    
    // Validate file size (max 10MB)
    if (req.file.size > 10 * 1024 * 1024) {
      // Delete uploaded file
      await fs.unlink(req.file.path);
      return res.status(400).json({ message: 'File size must be less than 10MB' });
    }
    
    // Create report record
    const report = await Report.create({
      patient: req.user.id,
      fileName: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      description: req.body.description || '',
      localPath: req.file.path
    });
    
    res.status(201).json(report);
  } catch (error) {
    // Delete uploaded file if there was an error
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting file:', unlinkError);
      }
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update report
// @route   PUT /api/reports/:id
// @access  Private
const updateReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    
    // Check if user is authorized to update this report
    if (report.patient.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to update this report' });
    }
    
    // Update report
    const updatedReport = await Report.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.status(200).json(updatedReport);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete report
// @route   DELETE /api/reports/:id
// @access  Private
const deleteReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    
    // Check if user is authorized to delete this report
    if (report.patient.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to delete this report' });
    }
    
    // Delete file from storage
    if (report.localPath) {
      try {
        await fs.unlink(report.localPath);
      } catch (error) {
        console.error('Error deleting file:', error);
      }
    }
    
    // Delete report record
    await Report.findByIdAndDelete(req.params.id);
    
    res.status(200).json({ message: 'Report removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    View report
// @route   GET /api/reports/:id/view
// @access  Private
const viewReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    
    // Check if user is authorized to access this report
    if (report.patient.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to access this report' });
    }
    
    // Serve the file
    res.sendFile(path.resolve(report.localPath));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Download report
// @route   GET /api/reports/:id/download
// @access  Private
const downloadReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    
    // Check if user is authorized to access this report
    if (report.patient.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to access this report' });
    }
    
    // Serve the file for download
    res.download(path.resolve(report.localPath), report.originalName);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get reports for admin view
// @route   GET /api/reports/admin/all
// @access  Private/Admin
const getAllReportsAdmin = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate('patient', 'name email')
      .sort({ createdAt: -1 });
    
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getReports,
  getReportById,
  uploadReport,
  updateReport,
  deleteReport,
  viewReport,
  downloadReport,
  getAllReportsAdmin
};