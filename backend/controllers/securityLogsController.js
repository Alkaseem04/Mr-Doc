const SecurityLog = require('../models/SecurityLog');

// @desc    Get all security logs
// @route   GET /api/security-logs
// @access  Private/Admin
const getSecurityLogs = async (req, res) => {
  try {
    const logs = await SecurityLog.find()
      .populate('user', 'name email')
      .sort({ timestamp: -1 })
      .limit(100); // Limit to last 100 logs
    
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSecurityLogs
};