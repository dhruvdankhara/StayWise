import { inject } from '@angular/core';
import { CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';

import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = async (_route, state: RouterStateSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  await authService.bootstrap();

  return authService.isAuthenticated
    ? true
    : router.createUrlTree(['/auth/login'], { queryParams: { returnUrl: state.url } });
};
