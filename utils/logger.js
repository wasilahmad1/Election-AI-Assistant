/**
 * Simple logger utility for standardizing console output.
 * In a production environment, this could be replaced with a library like Winston or Pino.
 */
const logger = {
    info: (message, meta = {}) => {
        console.log(`[${new Date().toISOString()}] [INFO] ${message}`, Object.keys(meta).length ? meta : '');
    },
    error: (message, error = {}) => {
        console.error(`[${new Date().toISOString()}] [ERROR] ${message}`, error);
    },
    warn: (message, meta = {}) => {
        console.warn(`[${new Date().toISOString()}] [WARN] ${message}`, Object.keys(meta).length ? meta : '');
    }
};

module.exports = logger;
