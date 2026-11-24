const logger = require('../utils/logger');

/**
 * 404 Route Not Found Middleware
 */
const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'ROUTE_NOT_FOUND',
      message: `Endpoint ${req.method} ${req.originalUrl} not found on this server.`
    }
  });
};

/**
 * Central Error Handler Middleware
 */
const errorHandler = (err, req, res, next) => {
  logger.error(`Request error on ${req.method} ${req.originalUrl}:`, err);

  // Body parser syntax error
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_JSON',
        message: 'Malformed JSON payload in request body.'
      }
    });
  }

  // Payload too large error
  if (err.type === 'entity.too.large') {
    return res.status(413).json({
      success: false,
      error: {
        code: 'PAYLOAD_TOO_LARGE',
        message: 'Request payload exceeds allowable limit (1MB).'
      }
    });
  }

  const statusCode = err.statusCode || err.status || 500;
  const message = statusCode === 500
    ? 'An unexpected internal server error occurred. Please try again later.'
    : err.message;

  res.status(statusCode).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_SERVER_ERROR',
      message
    }
  });
};

module.exports = {
  notFoundHandler,
  errorHandler
};
