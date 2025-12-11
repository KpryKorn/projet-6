import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, catchError, filter, switchMap, take, throwError } from 'rxjs';
import { AuthActions } from '../state/auth/auth.actions';
import { selectAccessToken, selectIsAuthenticated } from '../state/auth/auth.selectors';

let isRefreshing = false;

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
      if (token) {
        req = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401 && !isRefreshing) {
            isRefreshing = true;

            store.dispatch(AuthActions.refreshToken());

            return store.pipe(
              select(selectIsAuthenticated),
              filter((isAuthenticated) => isAuthenticated !== null),
              take(1),
              switchMap((isAuthenticated) => {
                isRefreshing = false;

                if (isAuthenticated) {
                  return store.pipe(
                    select(selectAccessToken),
                    take(1),
                    switchMap((newToken) => {
                      const newReq = req.clone({
                        setHeaders: {
                          Authorization: `Bearer ${newToken}`,
                        },
                      });
                      return next(newReq);
                    })
                  );
                } else {
                  store.dispatch(AuthActions.logout());
                  return throwError(() => error);
                }
              })
            );
          }

          return throwError(() => error);
        })
      );
    })
  );
};
