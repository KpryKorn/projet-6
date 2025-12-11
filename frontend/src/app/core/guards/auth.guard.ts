import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { selectIsAuthenticated } from '../state/auth/auth.selectors';

// todo: améliorer le guard pour qu'il attende la fin du check d'authentification avant de rediriger
export const authGuard: CanActivateFn = (): Observable<boolean> => {
  const store = inject(Store);
  const router = inject(Router);

  return store.pipe(
    select(selectIsAuthenticated),
    take(1),
    map((isAuthenticated) => {
      if (!isAuthenticated) {
        router.navigate(['/login']);
        return false;
      }
      return true;
    })
  );
};
