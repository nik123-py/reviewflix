const { body } = require('express-validator');

const movieValidation = {
    createMovie: [
        body('tmdbId')
            .notEmpty()
            .withMessage('TMDb ID is required')
            .isString()
            .withMessage('TMDb ID must be a string'),
        body('title')
            .notEmpty()
            .withMessage('Title is required')
            .isString()
            .withMessage('Title must be a string')
            .trim(),
        body('poster')
            .notEmpty()
            .withMessage('Poster URL is required')
            .isURL()
            .withMessage('Invalid poster URL')
            .trim(),
        body('rating')
            .notEmpty()
            .withMessage('Rating is required')
            .isFloat({ min: 0, max: 10 })
            .withMessage('Rating must be between 0 and 10'),
        body('genres')
            .isArray()
            .withMessage('Genres must be an array')
            .custom((value) => value.every((genre) => typeof genre === 'string'))
            .withMessage('All genres must be strings'),
        body('overview')
            .notEmpty()
            .withMessage('Overview is required')
            .isString()
            .withMessage('Overview must be a string')
            .trim(),
        body('releaseDate')
            .notEmpty()
            .withMessage('Release date is required')
            .isISO8601()
            .withMessage('Invalid release date format')
    ],
    updateMovie: [
        body('title')
            .optional()
            .isString()
            .withMessage('Title must be a string')
            .trim(),
        body('poster')
            .optional()
            .isURL()
            .withMessage('Invalid poster URL')
            .trim(),
        body('rating')
            .optional()
            .isFloat({ min: 0, max: 10 })
            .withMessage('Rating must be between 0 and 10'),
        body('genres')
            .optional()
            .isArray()
            .withMessage('Genres must be an array')
            .custom((value) => value.every((genre) => typeof genre === 'string'))
            .withMessage('All genres must be strings'),
        body('overview')
            .optional()
            .isString()
            .withMessage('Overview must be a string')
            .trim(),
        body('releaseDate')
            .optional()
            .isISO8601()
            .withMessage('Invalid release date format')
    ]
};

module.exports = movieValidation;