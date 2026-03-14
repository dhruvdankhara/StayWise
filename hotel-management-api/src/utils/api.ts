import type { Response } from 'express';

export const sendSuccess = <T>(
  response: Response,
  data: T,
  message = 'Request completed successfully',
  statusCode = 200
): void => {
  response.status(statusCode).json({
    success: true,
    message,
    data
  });
};
