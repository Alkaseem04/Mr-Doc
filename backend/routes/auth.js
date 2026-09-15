const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, verifyEmail, forgotPassword, resetPassword, verifyOTP } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.get('/verify-email/:token', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);
router.post('/verify-otp', verifyOTP);

module.exports = router;