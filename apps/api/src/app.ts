import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { env } from './config/env.js';
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js';
import type { ApiResponse, HealthStatusDto } from '@moneyflow/shared';

export const app = express();

// Security and standard middlewares
app.use(helmet());
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json({ limit: '1mb' }));

// Health Check Endpoint
app.get('/api/v1/health', (_req, res) => {
  const response: ApiResponse<HealthStatusDto> = {
    success: true,
    data: {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      environment: env.NODE_ENV,
      version: '0.1.0',
    },
  };
  res.status(200).json(response);
});

// 404 Handler for undefined routes
app.use(notFoundHandler);

// Centralized Error Handler
app.use(errorHandler);
