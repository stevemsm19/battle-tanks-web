import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthStore } from '../auth/store/auth.store';
import { filter, firstValueFrom } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';

export const authGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const authStore = inject(AuthStore);

  if (authStore.isLoading()) {
    await firstValueFrom(
      toObservable(authStore.isLoading).pipe(filter(loading => !loading))
    );
  }

  return authStore.user() ? true : router.navigate(['/login']);
};

export const publicGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authStore = inject(AuthStore);

  return authStore.user() ? router.navigate(['/play']) : true;
};
