// routes/authRoutes.js
const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { registerUser, loginUser } = require('../controllers/authController');
require('../config/passport')(passport);

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

// Google OAuth start
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback
router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/auth-failure.html`,
  }),
  (req, res) => {
    try {
      // 🔍 Debug: check JWT secret
      if (!process.env.JWT_SECRET) {
        console.error('❌ JWT_SECRET is not set in environment variables');
        return res.redirect(`${process.env.FRONTEND_URL}/auth-failure.html?error=jwt_secret_missing`);
      }

      // 🔍 Debug: check user
      if (!req.user) {
        console.error('❌ Google user not found after authentication');
        return res.redirect(`${process.env.FRONTEND_URL}/auth-failure.html?error=user_not_found`);
      }

      // ✅ Generate JWT token
      const token = jwt.sign(
        { id: req.user._id, role: req.user.role || 'user' },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      // 🧩 Debug logs — IMPORTANT
      console.log('✅ Google OAuth successful!');
      console.log('🧠 Generated Token:', token);
      console.log('🔗 Redirecting to:', `${process.env.FRONTEND_URL}/auth-success.html?token=${token}`);

      // ✅ Redirect to frontend with token
      res.redirect(`${process.env.FRONTEND_URL}/auth-success.html?token=${token}`);
    } catch (error) {
      console.error('❌ Error in Google OAuth callback:', error);
      res.redirect(`${process.env.FRONTEND_URL}/auth-failure.html?error=${encodeURIComponent(error.message)}`);
    }
  }
);

module.exports = router;
