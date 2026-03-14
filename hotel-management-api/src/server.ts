import { createApp } from './app';
import { connectDatabase } from './config/db';
import { env } from './config/env';
import { logger } from './services/logger';

const bootstrap = async (): Promise<void> => {
  await connectDatabase();

  const app = createApp();

  app.listen(env.PORT, () => {
    logger.info(`StayWise API listening on port ${env.PORT}`);
  });
};

bootstrap().catch((error: unknown) => {
  logger.error('Failed to start API', error);
  process.exit(1);
});
