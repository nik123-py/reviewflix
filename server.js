require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const Redis = require('redis');
const logger = require('./utils/logger');
const rateLimiter = require('./middleware/rateLimiter');
const helmet = require('helmet');
const compression = require('compression');

const app = express();

// Security and optimization middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));
app.use(compression());
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
app.use(express.static('public'));

// Rate limiting
app.use('/api/', rateLimiter);

// Request logging
app.use((req, res, next) => {
  logger.info('Incoming request', {
    method: req.method,
    path: req.path,
    ip: req.ip
  });
  next();
});

// Database connection logic
if (process.env.NODE_ENV === 'production') {
  const config = require('./config/production');
  
  // Connect to MongoDB with better error handling
  mongoose.connect(process.env.MONGODB_URI || config.mongodb.uri, config.mongodb.options)
    .then(() => logger.info('MongoDB connected successfully'))
    .catch(err => {
      logger.error('MongoDB connection failed:', err);
      process.exit(1);
    });

  // Initialize Redis client with connection verification
  const redisClient = Redis.createClient({
    url: process.env.REDIS_URL || config.redis.url,
    ...config.redis.options
  });
  
  redisClient.connect()
    .then(() => logger.info('Redis connected successfully'))
    .catch(err => logger.error('Redis connection failed:', err));

  redisClient.on('error', err => logger.error('Redis error:', err));
  global.redis = redisClient;

  // Add process error handlers
  process.on('unhandledRejection', err => {
    logger.error('Unhandled Promise Rejection:', err);
    process.exit(1);
  });

  process.on('uncaughtException', err => {
    logger.error('Uncaught Exception:', err);
    process.exit(1);
  });
} else {
  // Initialize in-memory storage for development
  const inMemoryDB = {
    movies: [],
    reviews: [],
    users: []
  };
  
  // Skip Redis and MongoDB for local deployment
  logger.info('Running in local mode with in-memory storage');
  
  // Export in-memory storage for routes
  global.db = inMemoryDB;
}

// Routes
app.use('/api/movies', require('./routes/movies'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/user', require('./routes/user'));

// Global error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });

  // Use the dedicated error handler from middleware
  const errorHandler = require('./middleware/errorHandler');
  errorHandler(err, req, res, next);
});


if (process.env.NODE_ENV === 'production') {
  // After database connections
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    logger.info(`Server running in production mode on port ${port}`);
  }).on('error', err => {
    logger.error('Server failed to start:', err);
    process.exit(1);
  });
} else {
  console.log(`Server running on port ${PORT}`);
}