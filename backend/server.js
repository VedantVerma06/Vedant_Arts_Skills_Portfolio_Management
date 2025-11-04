// server.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db.js');
const cors = require('cors');
const passport = require('passport');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const session = require('express-session'); // optional if you plan to use session-based OAuth
const errorHandler = require('./middleware/errorHandler');

dotenv.config();
connectDB();

const app = express();

// ✅ Security Middleware
app.use(helmet()); // sets secure headers
app.use(xss()); // prevents XSS attacks

// ✅ Rate Limiting (100 requests per 10 minutes per IP)
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP. Please try again later.',
});
app.use(limiter);

// ✅ Body Parser & CORS
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
  })
);

// ✅ Initialize Passport for Google OAuth
app.use(passport.initialize());
require('./config/passport')(passport);

// (Optional) Express-session only if needed for OAuth session flow
// app.use(session({ secret: process.env.SESSION_SECRET || 'vedantSecret', resave: false, saveUninitialized: false }));

// ✅ API Routes
app.use('/api/auth', require('./routes/authRoutes.js'));
app.use('/api/artworks', require('./routes/artworkRoutes.js'));
app.use('/api/orders', require('./routes/orderRoutes.js'));
app.use('/api/about', require('./routes/aboutRoutes.js'));
app.use('/api/admin', require('./routes/adminRoutes.js')); // simple admin login
app.use('/api/admin-dashboard', require('./routes/adminDashboardRoutes.js'));
app.use('/api/funfacts', require('./routes/funFactRoutes.js'));
app.use('/api/settings', require('./routes/adminSettingsRoutes.js'));

// ✅ Global Error Handler (always last)
app.use(errorHandler);

// ✅ Server Startup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running securely on port ${PORT}`));
