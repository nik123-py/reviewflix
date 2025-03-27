const { body } = require('express-validator');

const reviewValidation = {
    createReview: [
        body('movieId')
            .notEmpty()
            .withMessage('Movie ID is required')
            .isString()
            .withMessage('Movie ID must be a string'),
        body('rating')
            .notEmpty()
            .withMessage('Rating is required')
            .isFloat({ min: 1, max: 5 })
            .withMessage('Rating must be between 1 and 5'),
        body('review')
            .notEmpty()
            .withMessage('Review text is required')
            .isString()
            .withMessage('Review must be a string')
            .isLength({ min: 1, max: 1000 })
            .withMessage('Review must be between 1 and 1000 characters')
            .trim()
            .escape()
    ],
    updateReview: [
        body('rating')
            .optional()
            .isFloat({ min: 1, max: 5 })
            .withMessage('Rating must be between 1 and 5'),
        body('review')
            .optional()
            .isString()
            .withMessage('Review must be a string')
            .isLength({ min: 1, max: 1000 })
            .withMessage('Review must be between 1 and 1000 characters')
            .trim()
            .escape()
    ]
};

module.exports = reviewValidation;