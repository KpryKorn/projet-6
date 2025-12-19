import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject, Injector } from '@angular/core';
import { AuthStore } from '../store/auth/auth.store';
import { BehaviorSubject, Observable, catchError, filter, switchMap, take, throwError } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

function addTokenHeader(request: HttpRequest<unknown>, token: string | null): HttpRequest<unknown> {
  if (token) {
    return request.clone({
      headers: request.headers.set('Authorization', `Bearer ${token}`),
    });
  }
  return request;
}

function handle401Error(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
  authStore: InstanceType<typeof AuthStore>
): Observable<HttpEvent<unknown>> {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);
    authStore.refresh();

    return toObservable(authStore.accessToken).pipe(
      filter((token): token is string => !!token),
      take(1),
      switchMap((token) => {
        isRefreshing = false;
        refreshTokenSubject.next(token);
        return next(addTokenHeader(request, token));
      }),
      catchError((err) => {
        isRefreshing = false;
        authStore.logout();
        return throwError(() => err);
      })
    );
  }

  return refreshTokenSubject.pipe(
    filter((token) => token !== null),
    take(1),
    switchMap((token) => next(addTokenHeader(request, token)))
  );
}

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const injector = inject(Injector);
  let authStore: InstanceType<typeof AuthStore> | null = null;

  const getAuthStore = () => {
    if (!authStore) {
      authStore = injector.get(AuthStore);
    }
    return authStore;
  };

  const token = getAuthStore().accessToken();

  if (token) {
    req = addTokenHeader(req, token);
  }

  return next(req).pipe(
    catchError((error) => {
      if (
        error instanceof HttpErrorResponse &&
        error.status === 401 &&
        !req.url.includes('/api/auth/login') &&
        !req.url.includes('/api/auth/register')
      ) {
        return handle401Error(req, next, getAuthStore());
      }
      return throwError(() => error);
    })
  );
};
