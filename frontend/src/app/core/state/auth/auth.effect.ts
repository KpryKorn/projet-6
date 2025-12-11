import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of, tap } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';
import { AuthActions } from './auth.actions';

const handleAuthSuccess = (router: Router) =>
  tap(() => {
    router.navigate(['/']);
  });

export const authEffects = {
  initAuthCheck: createEffect(
    (actions$ = inject(Actions), authService = inject(AuthService)) => {
      return actions$.pipe(
        ofType(AuthActions.initAuthCheck),
        exhaustMap(() =>
          authService.refreshToken().pipe(
            map((response) => AuthActions.refreshTokenSuccess({ response })),
            catchError((error) => of(AuthActions.refreshTokenFailure({ error: error.message })))
          )
        )
      );
    },
    { functional: true }
  ),

  login: createEffect(
    (actions$ = inject(Actions), authService = inject(AuthService)) => {
      return actions$.pipe(
        ofType(AuthActions.login),
        exhaustMap(({ request }) =>
          authService.login(request).pipe(
            map((response) => AuthActions.loginSuccess({ response })),
            catchError((error) => of(AuthActions.loginFailure({ error: error.message })))
          )
        )
      );
    },
    { functional: true }
  ),

  register: createEffect(
    (actions$ = inject(Actions), authService = inject(AuthService)) => {
      return actions$.pipe(
        ofType(AuthActions.register),
        exhaustMap(({ request }) =>
          authService.register(request).pipe(
            map((response) => AuthActions.registerSuccess({ response })),
            catchError((error) => of(AuthActions.registerFailure({ error: error.message })))
          )
        )
      );
    },
    { functional: true }
  ),

  refreshToken: createEffect(
    (actions$ = inject(Actions), authService = inject(AuthService)) => {
      return actions$.pipe(
        ofType(AuthActions.refreshToken),
        exhaustMap(() =>
          authService.refreshToken().pipe(
            map((response) => AuthActions.refreshTokenSuccess({ response })),
            catchError((error) => of(AuthActions.refreshTokenFailure({ error: error.message })))
          )
        )
      );
    },
    { functional: true }
  ),

  logout: createEffect(
    (actions$ = inject(Actions), authService = inject(AuthService)) => {
      return actions$.pipe(
        ofType(AuthActions.logout),
        exhaustMap(() =>
          authService.logout().pipe(
            map(() => AuthActions.logoutSuccess()),
            catchError((error) => of(AuthActions.logoutFailure({ error: error.message })))
          )
        )
      );
    },
    { functional: true }
  ),

  redirectOnSuccess: createEffect(
    (actions$ = inject(Actions), router = inject(Router)) => {
      return actions$.pipe(
        ofType(AuthActions.loginSuccess, AuthActions.registerSuccess),
        handleAuthSuccess(router)
      );
    },
    { functional: true, dispatch: false }
  ),

  logoutRedirect: createEffect(
    (actions$ = inject(Actions), router = inject(Router)) => {
      return actions$.pipe(
        ofType(AuthActions.logoutSuccess),
        tap(() => router.navigate(['/']))
      );
    },
    { functional: true, dispatch: false }
  ),
};
