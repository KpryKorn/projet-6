import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { selectAuthStatus } from '../state/auth/auth.selectors';

export const authGuard: CanActivateFn = (): Observable<boolean> => {
  const store = inject(Store);
  const router = inject(Router);

  return store.pipe(
    select(selectAuthStatus),
    filter((status) => !status.isLoading),
    take(1),
    map((status) => {
      if (!status.isAuthenticated) {
        router.navigate(['/login']);
        return false;
      }
      return true;
    })
  );
};
