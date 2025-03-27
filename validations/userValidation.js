const { body } = require('express-validator');

const userValidation = {
    register: [
        body('username')
            .notEmpty()
            .withMessage('Username is required')
            .isString()
            .withMessage('Username must be a string')
            .isLength({ min: 3, max: 30 })
            .withMessage('Username must be between 3 and 30 characters')
            .matches(/^[a-zA-Z0-9_-]+$/)
            .withMessage('Username can only contain letters, numbers, underscores and hyphens')
            .trim(),
        body('email')
            .notEmpty()
            .withMessage('Email is required')
            .isEmail()
            .withMessage('Invalid email format')
            .normalizeEmail(),
        body('password')
            .notEmpty()
            .withMessage('Password is required')
            .isLength({ min: 8 })
            .withMessage('Password must be at least 8 characters long')
            .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/)
            .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number and one special character')
    ],
    login: [
        body('email')
            .notEmpty()
            .withMessage('Email is required')
            .isEmail()
            .withMessage('Invalid email format')
            .normalizeEmail(),
        body('password')
            .notEmpty()
            .withMessage('Password is required')
    ],
    updateProfile: [
        body('username')
            .optional()
            .isString()
            .withMessage('Username must be a string')
            .isLength({ min: 3, max: 30 })
            .withMessage('Username must be between 3 and 30 characters')
            .matches(/^[a-zA-Z0-9_-]+$/)
            .withMessage('Username can only contain letters, numbers, underscores and hyphens')
            .trim(),
        body('email')
            .optional()
            .isEmail()
            .withMessage('Invalid email format')
            .normalizeEmail(),
        body('currentPassword')
            .optional()
            .notEmpty()
            .withMessage('Current password is required when updating password'),
        body('newPassword')
            .optional()
            .isLength({ min: 8 })
            .withMessage('New password must be at least 8 characters long')
            .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/)
            .withMessage('New password must contain at least one uppercase letter, one lowercase letter, one number and one special character')
    ]
};

module.exports = userValidation;