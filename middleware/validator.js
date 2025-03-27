const { validationResult } = require('express-validator');
const logger = require('../utils/logger');

const validate = (validations) => {
    return async (req, res, next) => {
        // Execute all validations
        await Promise.all(validations.map(validation => validation.run(req)));

        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }

        // Log validation errors
        logger.warn('Validation error', {
            path: req.path,
            errors: errors.array(),
            body: req.body
        });

        return res.status(400).json({
            status: 'error',
            message: 'Validation failed',
            errors: errors.array().map(err => ({
                field: err.param,
                message: err.msg
            }))
        });
    };
};

module.exports = validate;