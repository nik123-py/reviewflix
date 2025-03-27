# Deployment Guide for ReviewFlix

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account or production MongoDB instance
- Redis Cloud account or production Redis instance
- Heroku account (or another cloud platform of your choice)

## Environment Setup

1. Clone the repository to your deployment environment
2. Copy `.env.production` to `.env` and update the following variables:
   ```
   MONGODB_URI=your_production_mongodb_uri
   REDIS_URL=your_production_redis_url
   JWT_SECRET=your_production_jwt_secret
   CORS_ORIGIN=your_production_domain
   TMDB_API_KEY=your_tmdb_api_key
   ```

## Database Setup

1. Create a MongoDB Atlas cluster or set up your production MongoDB instance
2. Create a new database named 'reviewflix'
3. Update the `MONGODB_URI` in your `.env` file with the connection string

## Redis Setup

1. Create a Redis Cloud instance or set up your production Redis server
2. Update the `REDIS_URL` in your `.env` file with the connection string

## Heroku Deployment

1. Install Heroku CLI and login:
   ```bash
   heroku login
   ```

2. Create a new Heroku app:
   ```bash
   heroku create your-app-name
   ```

3. Set environment variables on Heroku:
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set MONGODB_URI=your_production_mongodb_uri
   heroku config:set REDIS_URL=your_production_redis_url
   heroku config:set JWT_SECRET=your_production_jwt_secret
   heroku config:set CORS_ORIGIN=your_production_domain
   heroku config:set TMDB_API_KEY=your_tmdb_api_key
   ```

4. Deploy to Heroku:
   ```bash
   git push heroku main
   ```

## Manual Deployment

1. Install dependencies:
   ```bash
   npm install --production
   ```

2. Build the application:
   ```bash
   npm run build
   ```

3. Start the server:
   ```bash
   npm start
   ```

## Post-Deployment Checklist

- [ ] Verify all environment variables are correctly set
- [ ] Test database connection
- [ ] Test Redis connection
- [ ] Verify API endpoints are working
- [ ] Check error logging is working
- [ ] Test user authentication
- [ ] Monitor application performance

## Monitoring and Maintenance

- Check application logs in the `logs` directory
- Monitor server resources (CPU, memory, disk usage)
- Set up alerts for critical errors
- Regularly backup the database
- Keep dependencies updated

## Troubleshooting

- Check `error.log` and `combined.log` in the logs directory for errors
- Verify MongoDB and Redis connections
- Check CORS settings if facing API access issues
- Ensure proper network access to all required services