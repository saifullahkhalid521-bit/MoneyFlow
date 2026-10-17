import { app } from './app.js';
import { env } from './config/env.js';
import { logger } from './lib/logger.js';

const server = app.listen(env.PORT, () => {
  logger.info(`🚀 MoneyFlow API server running on port ${env.PORT} [${env.NODE_ENV}]`);
  logger.info(`Health check available at http://localhost:${env.PORT}/api/v1/health`);
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
  });
});
