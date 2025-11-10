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
router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:8000'}/auth-failure` }),
  (req, res) => {
    try {
      // Check if JWT_SECRET is set
      if (!process.env.JWT_SECRET) {
        console.error('❌ JWT_SECRET is not set in environment variables');
        return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:8000'}/auth-failure?error=jwt_secret_missing`);
      }

      // user is set on req.user
      if (!req.user) {
        return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:8000'}/auth-failure?error=user_not_found`);
      }

      const token = jwt.sign({ id: req.user._id, role: req.user.role || 'user' }, process.env.JWT_SECRET, { expiresIn: '7d' });
      // redirect to frontend with token
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:8000'}/auth-success?token=${token}`);
    } catch (error) {
      console.error('❌ Error in Google OAuth callback:', error);
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:8000'}/auth-failure?error=${encodeURIComponent(error.message)}`);
    }
  }
);

module.exports = router;
