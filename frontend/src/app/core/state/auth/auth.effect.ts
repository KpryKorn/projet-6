import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of, tap } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';
import { AuthActions } from './auth.actions';

// écoute toutes les actions de l'appli => réagit à une action spécifique pour appeler la méthode en question
export const loginEffect = createEffect(
  (actions$ = inject(Actions), authService = inject(AuthService)) => {
    return actions$.pipe(
      ofType(AuthActions.login), // filtre pour ne réagir qu'à l'action login
      exhaustMap(({ request }) =>
        authService.login(request).pipe(
          map((response) => AuthActions.loginSuccess({ response })),
          catchError((error) => of(AuthActions.loginFailure({ error })))
        )
      )
    );
  },
  { functional: true }
);

export const loginSuccessEffect = createEffect(
  (actions$ = inject(Actions)) => {
    return actions$.pipe(
      ofType(AuthActions.loginSuccess),
      tap(({ response }) => {
        localStorage.setItem('token', response.token);
      })
    );
  },
  { functional: true, dispatch: false }
);

export const registerEffect = createEffect(
  (actions$ = inject(Actions), authService = inject(AuthService)) => {
    return actions$.pipe(
      ofType(AuthActions.register),
      exhaustMap(({ request }) =>
        authService.register(request).pipe(
          map((response) => AuthActions.registerSuccess({ response })),
          catchError((error) => of(AuthActions.registerFailure({ error })))
        )
      )
    );
  },
  { functional: true }
);

export const registerSuccessEffect = createEffect(
  (actions$ = inject(Actions)) => {
    return actions$.pipe(
      ofType(AuthActions.registerSuccess),
      tap(({ response }) => {
        localStorage.setItem('token', response.token);
      })
    );
  },
  { functional: true, dispatch: false }
);
