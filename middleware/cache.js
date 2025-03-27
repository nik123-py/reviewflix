const Redis = require('redis');
const logger = require('../utils/logger');

class CacheMiddleware {
    constructor() {
        this.redisClient = null;
        this.defaultTTL = 3600; // 1 hour in seconds
        this.initRedis();
    }

    async initRedis() {
        try {
            this.redisClient = Redis.createClient({
                url: process.env.REDIS_URL || 'redis://localhost:6379'
            });
            this.redisClient.on('error', (err) => {
                logger.error('Redis cache error', { error: err.message });
            });
            await this.redisClient.connect();
        } catch (err) {
            logger.warn('Redis cache initialization failed - caching disabled', { error: err.message });
        }
    }

    cache(prefix, ttl = this.defaultTTL) {
        return async (req, res, next) => {
            if (req.method !== 'GET') {
                return next();
            }

            const key = `${prefix}:${req.originalUrl}`;

            if (!this.redisClient) {
                return next();
            }

            try {
                const cachedData = await this.redisClient.get(key);
                
                if (cachedData) {
                    logger.info('Cache hit', { key });
                    return res.json(JSON.parse(cachedData));
                }

                // Store original res.json function
                const originalJson = res.json;

                // Override res.json method to cache the response
                res.json = async (data) => {
                    try {
                        await this.redisClient.setEx(key, ttl, JSON.stringify(data));
                        logger.info('Cache set', { key, ttl });
                    } catch (err) {
                        logger.error('Cache set error', { error: err.message, key });
                    }

                    // Call original res.json with data
                    return originalJson.call(res, data);
                };

                next();
            } catch (err) {
                logger.error('Cache middleware error', { error: err.message, key });
                next();
            }
        };
    }

    invalidate(prefix) {
        return async (req, res, next) => {
            if (req.method === 'GET') {
                return next();
            }

            try {
                const pattern = `${prefix}:*`;
                const keys = await this.redisClient.keys(pattern);
                
                if (keys.length > 0) {
                    await this.redisClient.del(keys);
                    logger.info('Cache invalidated', { pattern, count: keys.length });
                }
            } catch (err) {
                logger.error('Cache invalidation error', { error: err.message });
            }

            next();
        };
    }
}

module.exports = new CacheMiddleware();