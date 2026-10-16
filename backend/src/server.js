const app = require('./app');
const config = require('./config/env');
const logger = require('./config/logger');

const server = app.listen(config.port, () => {
  logger.info(`AgroMinds Backend Server is actively listening on port ${config.port}`);
  logger.info(`Environment: ${config.nodeEnv}`);
  logger.info(`Interactive API Documentation: http://localhost:${config.port}/api-docs`);
  logger.info(`Health Endpoint: http://localhost:${config.port}/api/health`);
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server gracefully');
  server.close(() => {
    logger.info('HTTP server closed.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server gracefully');
  server.close(() => {
    logger.info('HTTP server closed.');
    process.exit(0);
  });
});
