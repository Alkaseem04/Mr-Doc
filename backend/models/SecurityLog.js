const mongoose = require('mongoose');

const SecurityLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  email: {
    type: String,
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: ['login_attempt', 'otp_verified', 'password_reset', 'failed_login', 'logout']
  },
  ip: {
    type: String,
    required: true
  },
  userAgent: {
    type: String
  },
  status: {
    type: String,
    required: true,
    enum: ['success', 'failed', 'pending']
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('SecurityLog', SecurityLogSchema);