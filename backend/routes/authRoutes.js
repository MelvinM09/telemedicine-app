const express = require('express');
const router = express.Router();
const {
  register,
  verifyOtp,
  login,
  logout
} = require('../controllers/authController');

// Authentication routes
router.post('/register', register);      // Register a new user and send OTP
router.post('/verify-otp', verifyOtp);   // Verify OTP and complete registration
router.post('/login', login);            // Log in a verified user
router.post('/logout', logout);          // Log out the user

module.exports = router;