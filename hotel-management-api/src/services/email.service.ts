import { randomBytes } from 'crypto';

import { env } from '../config/env';
import { mailTransporter } from '../config/mailer';
import { logger } from './logger';

export const generateToken = (): string => randomBytes(24).toString('hex');

export const sendEmail = async (to: string, subject: string, html: string): Promise<void> => {
  try {
    await mailTransporter.sendMail({
      from: env.MAIL_FROM,
      to,
      subject,
      html
    });
  } catch (error) {
    logger.warn('Failed to send email', { to, subject, error });
  }
};
