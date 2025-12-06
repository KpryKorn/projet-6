import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';
import { AuthActions } from './auth.actions';

// écoute toutes les actions de l'appli => réagit à une action spécifique pour appeler la méthode en question
export const loginEffect = createEffect(
  (actions$ = inject(Actions), authService = inject(AuthService)) => {
    return actions$.pipe(
      ofType(AuthActions.login),
      exhaustMap(({ payload }) =>
        authService.login(payload).pipe(
          map((response) => AuthActions.loginSuccess({ response })),
          catchError((error) => of(AuthActions.loginFailure({ error })))
        )
      )
    );
  },
  { functional: true }
);
