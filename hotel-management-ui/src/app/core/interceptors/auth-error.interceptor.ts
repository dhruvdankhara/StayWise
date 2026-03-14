import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import { AuthService } from '../services/auth.service';

export const authErrorInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthService);

  return next(request).pipe(
    catchError((error: unknown) => {
      if (
        error instanceof HttpErrorResponse &&
        error.status === 401 &&
        !request.url.includes('/auth/login') &&
        !request.url.includes('/auth/register')
      ) {
        authService.clearSession(false);
      }

      return throwError(() => error);
    })
  );
};
