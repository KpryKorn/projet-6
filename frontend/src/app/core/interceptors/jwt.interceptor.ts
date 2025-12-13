import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { BehaviorSubject, Observable, catchError, filter, switchMap, take, throwError } from 'rxjs';
import { AuthActions } from '../store/auth/auth.actions';
import { selectAccessToken } from '../store/auth/auth.selectors';

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
  store: Store
): Observable<HttpEvent<unknown>> {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);
    store.dispatch(AuthActions.refreshToken());

    return store.pipe(
      select(selectAccessToken),
      filter((token) => token !== null),
      take(1),
      switchMap((token) => {
        isRefreshing = false;
        refreshTokenSubject.next(token);
        return next(addTokenHeader(request, token));
      }),
      catchError((err) => {
        isRefreshing = false;
        store.dispatch(AuthActions.logout());
        return throwError(() => err);
      })
    );
  } else {
    return refreshTokenSubject.pipe(
      filter((token) => token !== null),
      take(1),
      switchMap((token) => next(addTokenHeader(request, token)))
    );
  }
}

export const jwtInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const store = inject(Store);

  if (req.url.includes('/api/auth/')) {
    return next(req);
  }

  return store.pipe(
    select(selectAccessToken),
    take(1),
    switchMap((token) => {
      const clonedReq = addTokenHeader(req, token);
      return next(clonedReq).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            return handle401Error(req, next, store);
          }
          return throwError(() => error);
        })
      );
    })
  );
};
