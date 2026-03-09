import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, from, switchMap, throwError } from 'rxjs';
import { LoginService } from '../auth/pages/login/services/login.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const loginService = inject(LoginService);
  const router = inject(Router);

  return from(loginService.getToken()).pipe(
    switchMap((token) => {
      const request = token
        ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
        : req;

      return next(request).pipe(
        catchError((error) => {
          if (error.status === 401 || error.status === 403) {
            loginService.logout().then(() => {
              router.parseUrl('/login');
            });
          }
          return throwError(() => error);
        }),
      );
    }),
  );
};
