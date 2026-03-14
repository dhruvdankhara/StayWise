import type { NextFunction, Request, Response } from 'express';
import type { ZodType } from 'zod';

export const validate =
  (schema: ZodType) =>
  (request: Request, _response: Response, next: NextFunction): void => {
    schema.parse({
      body: request.body,
      query: request.query,
      params: request.params
    });
    next();
  };
