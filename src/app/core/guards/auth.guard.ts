import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { LoginService } from '../auth/pages/login/services/login.service';
import { map, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const loginService = inject(LoginService);

  return loginService.user$.pipe(
    take(1),
    map((user) => {
      if (user) {
        return true;
      } else {
        router.navigate(['/login']);
        return false;
      }
    }),
  );
};

export const publicGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const loginService = inject(LoginService);

  return loginService.user$.pipe(
    take(1),
    map((user) => {
      if (user) {
        router.navigate(['/play']);
        return false;
      } else {
        return true;
      }
    }),
  );
};
