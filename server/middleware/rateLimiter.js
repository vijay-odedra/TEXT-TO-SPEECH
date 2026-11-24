/**
 * In-memory sliding-window rate limiter
 */
const requestMap = new Map();

// Clean up expired buckets periodically (unref so tests exit cleanly)
const cleanupInterval = setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of requestMap.entries()) {
    if (now - data.startTime > data.windowMs) {
      requestMap.delete(ip);
    }
  }
}, 60000);

if (cleanupInterval.unref) {
  cleanupInterval.unref();
}

const rateLimiter = (options = {}) => {
  const windowMs = options.windowMs || 60 * 1000; // 1 minute
  const max = options.max || 60; // 60 requests per minute

  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    const now = Date.now();

    let clientData = requestMap.get(ip);
    if (!clientData || now - clientData.startTime > windowMs) {
      clientData = {
        startTime: now,
        count: 1,
        windowMs
      };
      requestMap.set(ip, clientData);
      return next();
    }

    clientData.count += 1;
    if (clientData.count > max) {
      return res.status(429).json({
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many requests. Please slow down and try again after a minute.'
        }
      });
    }

    next();
  };
};

module.exports = rateLimiter;
