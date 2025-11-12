const jwt = require('jsonwebtoken');
const User = require('../models/User'); // ✅ Import User model

const protect = async (req, res, next) => {
  const header = req.headers.authorization;
  const token = header && header.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // ✅ Fetch full user document (exclude password)
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) return res.status(404).json({ message: 'User not found' });
    next();
  } catch (error) {
    console.error('JWT Error:', error.message);
    res.status(401).json({ message: 'Token not valid' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
  next();
};

module.exports = { protect, adminOnly };
