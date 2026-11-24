require('dotenv').config();
const express = require('express');
const cors = require('cors');
const healthRoutes = require('./routes/healthRoutes');
const ttsRoutes = require('./routes/ttsRoutes');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');
const logger = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 5005;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// CORS configuration
const allowedOrigins = [
  CLIENT_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000'
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(null, true); // Dev-friendly fallback
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser with 1MB limit to prevent memory exhaustion
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Request logging in development
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Mount Routes
app.use('/api', healthRoutes);
app.use('/api', ttsRoutes);

// Root greeting endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    name: 'Text-to-Speech Studio API',
    version: '1.0.0',
    status: 'online',
    endpoints: {
      health: '/api/health',
      voices: '/api/voices',
      status: '/api/status',
      tts: '/api/tts'
    }
  });
});

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server when run directly
if (require.main === module) {
  const server = app.listen(PORT, () => {
    logger.info(`Text-to-Speech server listening on port ${PORT}`);
    logger.info(`API Base URL: http://localhost:${PORT}/api`);
  });

  // Graceful shutdown
  const shutdown = () => {
    logger.info('Shutting down server gracefully...');
    server.close(() => {
      logger.info('HTTP server closed.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

module.exports = app;
