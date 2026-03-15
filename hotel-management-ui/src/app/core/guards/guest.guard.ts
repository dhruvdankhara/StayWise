import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { dashboardRouteByRole } from '../models/navigation';
import { AuthService } from '../services/auth.service';

export const guestGuard: CanActivateFn = async (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  await authService.bootstrap();

  const user = authService.user();
  if (user) {
    const returnUrl = route.queryParams['returnUrl'];
    return router.createUrlTree([returnUrl || dashboardRouteByRole[user?.role] || '/']);
  }

  return true;
};
