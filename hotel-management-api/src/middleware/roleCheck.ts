import type { NextFunction, Request, Response } from 'express';

import type { Role } from '../constants/enums';
import { AppError } from '../utils/AppError';

export const requireRole =
  (...allowedRoles: Role[]) =>
  (request: Request, _response: Response, next: NextFunction): void => {
    if (!request.user) {
      next(new AppError(401, 'Authentication required'));
      return;
    }

    if (!allowedRoles.includes(request.user.role)) {
      next(new AppError(403, 'You do not have permission to perform this action'));
      return;
    }

    next();
  };
