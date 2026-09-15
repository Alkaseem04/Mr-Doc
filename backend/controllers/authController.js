const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/User');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const SecurityLog = require('../models/SecurityLog');
const { getIP } = require('../utils/ipUtils');
const nodemailer = require('nodemailer');

const mongoose = require('mongoose');

// Check if we have a database connection
const hasDatabaseConnection = () => {
  return mongoose.connection.readyState === 1;
};

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Check if we have database connection
    if (!hasDatabaseConnection()) {
      // For demo purposes without database, we'll simulate success
      // In a real application, you would need a database
      console.log('No database connection, simulating user registration');
      
      // Generate verification token
      const verificationToken = crypto.randomBytes(20).toString('hex');
      
      // Simulate sending verification email
      console.log(`Would send verification email to ${email} with token ${verificationToken}`);
      
      return res.status(201).json({
        _id: 'demo-user-id',
        name: name,
        email: email,
        role: role,
        message: 'Signup successful! Please check your email for verification link.'
      });
    }
    
    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(20).toString('hex');

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role,
      verificationToken,
      isVerified: false
    });

    // Create patient or doctor profile based on role
    if (role === 'patient') {
      await Patient.create({ user: user._id });
    } else if (role === 'doctor') {
      await Doctor.create({ user: user._id });
    }

    // Send notification to admins
    try {
      await fetch(`${process.env.SERVER_URL}/api/notifications/new-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: {
            name,
            role
          }
        })
      });
    } catch (error) {
      console.error('Error sending notification:', error);
    }

    // Send verification email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Welcome to Mr. Doc — Verify Your Account',
      text: `Hello ${user.name}, please verify your email to activate your Mr. Doc account. Click here: ${process.env.CLIENT_URL}/verify-email/${verificationToken}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Email sending error:', error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      message: 'Signup successful! Please check your email for verification link.'
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if we have database connection
    if (!hasDatabaseConnection()) {
      // For demo purposes without database, we'll simulate login
      // In a real application, you would need a database
      console.log('No database connection, simulating user login');
      
      // Simulate user data
      const users = {
        'admin@mrdoc.com': { 
          _id: 'admin-id', 
          name: 'Admin User', 
          email: 'admin@mrdoc.com', 
          role: 'admin', 
          password: 'admin123',
          isVerified: true
        },
        'doctor@mrdoc.com': { 
          _id: 'doctor-id', 
          name: 'Doctor User', 
          email: 'doctor@mrdoc.com', 
          role: 'doctor', 
          password: 'doctor123',
          isVerified: true
        },
        'patient@mrdoc.com': { 
          _id: 'patient-id', 
          name: 'Patient User', 
          email: 'patient@mrdoc.com', 
          role: 'patient', 
          password: 'patient123',
          isVerified: true
        }
      };
      
      const user = users[email];
      
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
      
      // Check if user is verified
      if (!user.isVerified) {
        return res.status(401).json({ message: 'Please verify your email before logging in' });
      }
      
      // Check password
      if (password !== user.password) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
      
      // If user is admin, require 2FA
      if (user.role === 'admin') {
        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
        
        // Simulate sending OTP email
        console.log(`Would send OTP ${otp} to admin ${email}`);
        
        return res.status(200).json({ 
          message: 'OTP sent to your email', 
          require2FA: true,
          userId: user._id
        });
      }
      
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    }
    
    // Check for user email
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      // Check if user is verified
      if (!user.isVerified) {
        return res.status(401).json({ message: 'Please verify your email before logging in' });
      }

      // If user is admin, require 2FA
      if (user.role === 'admin') {
        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
        
        // Hash OTP and set expiry
        user.otp = await bcrypt.hash(otp, 10);
        user.otpExpires = Date.now() + 5 * 60 * 1000; // 5 minutes
        
        await user.save();
        
        // Send OTP email
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        });
        
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: user.email,
          subject: 'Mr. Doc Admin Login Verification Code',
          text: `Your one-time verification code is ${otp}. It expires in 5 minutes.`
        };
        
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error('Email sending error:', error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
        
        return res.status(200).json({ 
          message: 'OTP sent to your email', 
          require2FA: true,
          userId: user._id
        });
      }

      // Update last login time
      await User.findByIdAndUpdate(user._id, { lastLogin: Date.now() });

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Verify user email
// @route   GET /api/auth/verify-email/:token
// @access  Public
const verifyEmail = async (req, res) => {
  try {
    // Check if we have database connection
    if (!hasDatabaseConnection()) {
      // For demo purposes without database, we'll simulate email verification
      // In a real application, you would need a database
      console.log('No database connection, simulating email verification');
      
      // Simulate successful verification
      return res.status(200).json({ message: 'Email verified successfully. You can now login.' });
    }
    
    const user = await User.findOne({
      verificationToken: req.params.token
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid verification token' });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({ message: 'Email verified successfully. You can now login.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Request password reset
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    
    // Hash token and set expiry
    user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.passwordResetExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
    
    await user.save();
    
    // Send email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Mr. Doc — Password Reset Request',
      text: `Click the link below to reset your password. This link expires in 15 minutes.

${resetUrl}

If you did not request this, please ignore this email.`
    };
    
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Email sending error:', error);
        return res.status(500).json({ message: 'Email could not be sent' });
      }
      
      res.status(200).json({ message: 'Password reset email sent' });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:token
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    
    // Hash token
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    
    // Find user with valid token and not expired
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }
    
    // Set new password
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    
    await user.save();
    
    res.status(200).json({ message: 'Password reset successful. Please login again.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify OTP for 2FA
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOTP = async (req, res) => {
  try {
    const { userId, otp } = req.body;
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if OTP is valid and not expired
    if (user.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'OTP has expired' });
    }
    
    // Verify OTP
    const isMatch = await bcrypt.compare(otp, user.otp);
    
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }
    
    // Clear OTP
    user.otp = undefined;
    user.otpExpires = undefined;
    
    // Update last login time
    user.lastLogin = Date.now();
    
    await user.save();
    
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
      message: 'Admin login successful'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  verifyEmail,
  forgotPassword,
  resetPassword,
  verifyOTP
};