const nodemailer = require('nodemailer');
const User = require('../models/User');

// @desc    Send notification when report is uploaded
// @route   POST /api/notifications/report-uploaded
// @access  Private
const reportUploaded = async (req, res) => {
  try {
    // Get admin users
    const admins = await User.find({ role: 'admin' });
    
    if (admins.length === 0) {
      return res.status(404).json({ message: 'No admins found' });
    }
    
    // Send email to each admin
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    
    const { fileName } = req.body;
    
    for (const admin of admins) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: admin.email,
        subject: 'New Report Uploaded',
        text: `Patient ${req.user.name} has uploaded a new medical report (${fileName}) for your review.`
      };
      
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Email sending error:', error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    }
    
    res.status(200).json({ message: 'Notification sent to admins' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Send notification when new user registers
// @route   POST /api/notifications/new-user
// @access  Private
const newUserRegistered = async (req, res) => {
  try {
    // Get admin users
    const admins = await User.find({ role: 'admin' });
    
    if (admins.length === 0) {
      return res.status(404).json({ message: 'No admins found' });
    }
    
    // Send email to each admin
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    
    const { user } = req.body;
    
    for (const admin of admins) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: admin.email,
        subject: `New User Registration - ${user.role}`,
        text: `A new ${user.role} named ${user.name} has just registered on Mr. Doc.`
      };
      
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Email sending error:', error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    }
    
    res.status(200).json({ message: 'Notification sent to admins' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  reportUploaded,
  newUserRegistered
};