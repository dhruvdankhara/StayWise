type LogLevel = 'info' | 'warn' | 'error';

const write = (level: LogLevel, message: string, meta?: unknown): void => {
  const payload = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...(meta ? { meta } : {})
  };

  const content = JSON.stringify(payload);

  if (level === 'error') {
    console.error(content);
    return;
  }

  console.log(content);
};

export const logger = {
  info: (message: string, meta?: unknown): void => write('info', message, meta),
  warn: (message: string, meta?: unknown): void => write('warn', message, meta),
  error: (message: string, meta?: unknown): void => write('error', message, meta)
};
