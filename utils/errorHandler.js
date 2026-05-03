const logger = require('./logger');

/**
 * Centralized error handling middleware for Express
 */
const errorHandler = (err, req, res, next) => {
    logger.error(`Error processing ${req.method} ${req.url}`, err);

    // Default error status and message
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';

    res.status(status).json({
        error: message,
        // Only send stack trace in development
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

module.exports = errorHandler;
