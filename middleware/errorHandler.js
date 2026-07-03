// middleware/errorHandler.js — centralized error handler (mount last)
const logger = require('../utils/logger');

function notFoundHandler(req, res) {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.originalUrl} not found.` });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  logger.error(err);

  // Postgres unique violation (duplicate email) as a safety net,
  // in case it wasn't caught earlier in the controller.
  if (err.code === '23505') {
    return res.status(409).json({ success: false, message: 'This email has already been registered.' });
  }

  const status = err.statusCode || 500;
  const message =
    process.env.NODE_ENV === 'production' && status === 500
      ? 'An unexpected error occurred. Please try again later.'
      : err.message;

  res.status(status).json({ success: false, message });
}

module.exports = { notFoundHandler, errorHandler };
