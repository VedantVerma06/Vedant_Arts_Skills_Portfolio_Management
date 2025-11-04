const jwt = require('jsonwebtoken');

const protect = (req, res,next) => {
  const header = req.headers.authorization;
  let token = header && header.split(' ')[1];
  if(!token) return res.status(401).json({ message: 'No token, authorization denied' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // decoded contains { id, role }
    next();
  } catch(error){
    res.status(401).json({ message: 'Token not valid' });
  }
};

const adminOnly = (req, res, next) => {
  if(req.user?.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
  next();
};

module.exports = { protect, adminOnly };
