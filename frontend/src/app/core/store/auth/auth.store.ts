import { computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LoginRequest, RegisterRequest } from '@models/auth';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { AuthService } from '@services/auth/auth.service';
import { ToastService } from '@services/toast/toast.service';
import { catchError, finalize, firstValueFrom, map, Observable, of, shareReplay } from 'rxjs';

export type AuthStatus = 'unknown' | 'authenticated' | 'anonymous';

interface AuthState {
  accessToken: string | null;
  status: AuthStatus;
}

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState<AuthState>({ accessToken: null, status: 'unknown' }),
  withComputed(({ status }) => ({
    isAuthenticated: computed(() => status() === 'authenticated'),
  })),
  withMethods(
    (
      store,
      authService = inject(AuthService),
      router = inject(Router),
      toast = inject(ToastService),
    ) => {
      let inflight: Observable<string | null> | null = null;

      const signIn = (token: string) =>
        patchState(store, { accessToken: token, status: 'authenticated' });
      const signOut = () => patchState(store, { accessToken: null, status: 'anonymous' });

      return {
        /** Restores the session from the refresh cookie when the app starts. */
        async init(): Promise<void> {
          try {
            signIn((await firstValueFrom(authService.refresh())).accessToken);
          } catch {
            signOut();
          }
        },

        async login(request: LoginRequest): Promise<void> {
          signIn((await firstValueFrom(authService.login(request))).accessToken);
        },

        async register(request: RegisterRequest): Promise<void> {
          signIn((await firstValueFrom(authService.register(request))).accessToken);
        },

        async logout(): Promise<void> {
          try {
            await firstValueFrom(authService.logout());
          } catch {
            // The cookie may already be gone, the local session ends either way.
          }
          signOut();
          await router.navigateByUrl('/');
        },

        /** One refresh at a time, even when several requests fail together. */
        refreshToken(): Observable<string | null> {
          inflight ??= authService.refresh().pipe(
            map((response) => {
              signIn(response.accessToken);
              return response.accessToken;
            }),
            catchError(() => {
              signOut();
              toast.info('Ta session a expiré. Une nouvelle connexion est nécessaire.');
              router.navigate(['/login']);
              return of(null);
            }),
            finalize(() => (inflight = null)),
            shareReplay(1),
          );
          return inflight;
        },
      };
    },
  ),
);
