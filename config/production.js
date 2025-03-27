module.exports = {
    // Server Configuration
    port: process.env.PORT || 5000,
    nodeEnv: 'production',

    // Database Configuration
    mongodb: {
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/reviewflix',
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000
        }
    },

    // Redis Configuration
    redis: {
        url: process.env.REDIS_URL || 'redis://localhost:6379',
        options: {
            retryStrategy: (times) => Math.min(times * 50, 2000)
        }
    },

    // CORS Configuration
    cors: {
        origin: process.env.CORS_ORIGIN || '*',
        credentials: true
    },

    // Security Configuration
    security: {
        rateLimitRequests: 100,
        rateLimitWindowMs: 15 * 60 * 1000, // 15 minutes
        jwtSecret: process.env.JWT_SECRET,
        jwtExpire: process.env.JWT_EXPIRE || '24h'
    },

    // API Configuration
    api: {
        tmdb: {
            key: process.env.TMDB_API_KEY,
            baseUrl: process.env.TMDB_API_BASE_URL || 'https://api.themoviedb.org/3'
        }
    },

    // Logging Configuration
    logging: {
        level: 'info',
        format: 'json'
    }
};