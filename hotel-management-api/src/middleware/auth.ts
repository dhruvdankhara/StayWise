import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { env } from '../config/env';
import { UserModel } from '../models/User';
import { AppError } from '../utils/AppError';

type JwtPayload = {
  sub: string;
  role: string;
  email: string;
  name: string;
};

export const requireAuth = async (request: Request, _response: Response, next: NextFunction): Promise<void> => {
  const authHeader = request.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    next(new AppError(401, 'Authentication required'));
    return;
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    const user = await UserModel.findById(decoded.sub).select('_id role email name isActive');

    if (!user || !user.isActive) {
      next(new AppError(401, 'User is not active'));
      return;
    }

    request.user = {
      id: user.id,
      role: user.role,
      email: user.email,
      name: user.name
    };

    next();
  } catch {
    next(new AppError(401, 'Invalid or expired token'));
  }
};
