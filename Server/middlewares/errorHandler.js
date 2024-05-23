// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  let statusCode = err.status || 500;
  let message = err.message || "Internal Server Error";

  res.status(statusCode).json({ error: message });
};

module.exports = errorHandler;
