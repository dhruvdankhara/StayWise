import { inject } from '@angular/core';
import { CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';

import type { UserRole } from '../models/app.models';
import { AuthService } from '../services/auth.service';

export const roleGuard =
  (roles: UserRole[]): CanActivateFn =>
  async (_route, state: RouterStateSnapshot) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    await authService.bootstrap();
    const user = authService.user();

    if (!user) {
      return router.createUrlTree(['/auth/login'], { queryParams: { returnUrl: state.url } });
    }

    return roles.includes(user.role) ? true : router.createUrlTree(['/']);
  };
