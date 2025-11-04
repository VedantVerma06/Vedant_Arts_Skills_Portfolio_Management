// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  console.error(`❌ Error: ${err.message}`);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

module.exports = errorHandler;
