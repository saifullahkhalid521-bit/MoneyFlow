type LogLevel = 'info' | 'warn' | 'error' | 'debug';

const SENSITIVE_KEYS = ['password', 'token', 'secret', 'authorization', 'cookie', 'jwt'];

function sanitize(data: unknown): unknown {
  if (typeof data !== 'object' || data === null) {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(sanitize);
  }

  const sanitized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    if (SENSITIVE_KEYS.some((sensitive) => key.toLowerCase().includes(sensitive))) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitize(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

function formatLog(level: LogLevel, message: string, meta?: unknown): string {
  const timestamp = new Date().toISOString();
  const metaStr = meta ? ` ${JSON.stringify(sanitize(meta))}` : '';
  return `[${timestamp}] [${level.toUpperCase()}] ${message}${metaStr}`;
}

export const logger = {
  info: (message: string, meta?: unknown) => console.log(formatLog('info', message, meta)),
  warn: (message: string, meta?: unknown) => console.warn(formatLog('warn', message, meta)),
  error: (message: string, meta?: unknown) => console.error(formatLog('error', message, meta)),
  debug: (message: string, meta?: unknown) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(formatLog('debug', message, meta));
    }
  },
};
