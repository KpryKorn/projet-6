import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { signalStore, withState, withMethods, patchState, withHooks } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap, catchError, of } from 'rxjs';
import { AuthService } from '../../services/api/auth/auth.service';
import { LoginRequest, RegisterRequest } from '../../models/auth';

export interface AuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  accessToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, authService = inject(AuthService), router = inject(Router)) => ({
    login: rxMethod<LoginRequest>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null })),
        switchMap((request) =>
          authService.login(request).pipe(
            tap((response) => {
              patchState(store, {
                accessToken: response.accessToken,
                isAuthenticated: true,
                isLoading: false,
              });
              router.navigate(['/feed']);
            }),
            catchError((error) => {
              patchState(store, {
                isLoading: false,
                error: error.error?.message || error.message || 'Login failed',
              });
              return of(null);
            })
          )
        )
      )
    ),
    register: rxMethod<RegisterRequest>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null })),
        switchMap((request) =>
          authService.register(request).pipe(
            tap((response) => {
              patchState(store, {
                accessToken: response.accessToken,
                isAuthenticated: true,
                isLoading: false,
              });
              router.navigate(['/feed']);
            }),
            catchError((error) => {
              patchState(store, {
                isLoading: false,
                error: error.error?.message || error.message || 'Registration failed',
              });
              return of(null);
            })
          )
        )
      )
    ),
    logout: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(() =>
          authService.logout().pipe(
            tap(() => {
              patchState(store, initialState);
              router.navigate(['/']);
            }),
            catchError((error) => {
              patchState(store, { ...initialState, error: error.message });
              router.navigate(['/']);
              return of(null);
            })
          )
        )
      )
    ),
    refresh: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(() =>
          authService.refreshToken().pipe(
            tap((response) => {
              patchState(store, {
                accessToken: response.accessToken,
                isAuthenticated: true,
                isLoading: false,
              });
            }),
            catchError((error) => {
              patchState(store, { ...initialState, error: error.message });
              return of(null);
            })
          )
        )
      )
    ),
  }))
);
