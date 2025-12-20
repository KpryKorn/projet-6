import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '../store/auth/auth.store';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, map, take } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  return toObservable(authStore.isLoading).pipe(
    filter((isLoading) => !isLoading),
    take(1),
    map(() => {
      if (!authStore.isAuthenticated()) {
        router.navigate(['/']);
        return false;
      }
      return true;
    })
  );
};
