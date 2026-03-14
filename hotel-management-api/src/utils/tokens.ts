import jwt from 'jsonwebtoken';

import { env } from '../config/env';

export const signJwt = (payload: Record<string, unknown>): string =>
  jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN
  });
