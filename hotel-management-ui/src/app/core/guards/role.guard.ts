import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import type { UserRole } from '../models/app.models';
import { AuthService } from '../services/auth.service';

export const roleGuard = (roles: UserRole[]): CanActivateFn => async () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  await authService.bootstrap();
  const user = authService.user();

  if (!user) {
    return router.createUrlTree(['/auth/login']);
  }

  return roles.includes(user.role) ? true : router.createUrlTree(['/']);
};
