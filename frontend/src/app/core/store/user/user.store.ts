import { inject, effect } from '@angular/core';
import { signalStore, withState, withMethods, patchState, withHooks } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap, catchError, of, filter, exhaustMap } from 'rxjs';
import { UserService } from '@services/user/user.service';
import { SubjectsService } from '@services/subjects/subjects.service';
import { User, UserRequest } from '@models/user';
import { Subject } from '@models/subject';

export interface UserState {
  user: User | null;
  subscriptions: Subject[] | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  subscriptions: null,
  isLoading: false,
  error: null,
};

export const UserStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods(
    (store, userService = inject(UserService), subjectsService = inject(SubjectsService)) => ({
      fetchMe: rxMethod<void>(
        pipe(
          filter(() => !store.user() || !!store.error()),
          tap(() => patchState(store, { isLoading: true, error: null })),
          exhaustMap(() =>
            userService.me().pipe(
              tap((user) => patchState(store, { user, isLoading: false })),
              catchError((error) => {
                patchState(store, { isLoading: false, error: error.message });
                return of(null);
              })
            )
          )
        )
      ),
      updateMe: rxMethod<Partial<UserRequest>>(
        pipe(
          tap(() => patchState(store, { isLoading: true, error: null })),
          switchMap((userData) =>
            userService.updateMe(userData).pipe(
              tap((user) => patchState(store, { user, isLoading: false })),
              catchError((error) => {
                patchState(store, { isLoading: false, error: error.message });
                return of(null);
              })
            )
          )
        )
      ),
      fetchMySubscriptions: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { isLoading: true, error: null })),
          exhaustMap(() =>
            userService.getMySubscriptions().pipe(
              tap((subscriptions) => patchState(store, { subscriptions, isLoading: false })),
              catchError((error) => {
                patchState(store, { isLoading: false, error: error.message });
                return of(null);
              })
            )
          )
        )
      ),
      subscribeToSubject: rxMethod<number>(
        pipe(
          tap(() => patchState(store, { isLoading: true, error: null })),
          switchMap((subjectId) =>
            subjectsService.subscribeToSubject(subjectId).pipe(
              switchMap(() => userService.me()),
              tap((user) => patchState(store, { user, isLoading: false })),
              catchError((error) => {
                patchState(store, { isLoading: false, error: error.message });
                return of(null);
              })
            )
          )
        )
      ),
      unsubscribeFromSubject: rxMethod<number>(
        pipe(
          tap(() => patchState(store, { isLoading: true, error: null })),
          switchMap((subjectId) =>
            subjectsService.unsubscribeFromSubject(subjectId).pipe(
              switchMap(() =>
                userService
                  .me()
                  .pipe(
                    switchMap((user) =>
                      userService
                        .getMySubscriptions()
                        .pipe(
                          tap((subscriptions) =>
                            patchState(store, { user, subscriptions, isLoading: false })
                          )
                        )
                    )
                  )
              ),
              catchError((error) => {
                patchState(store, { isLoading: false, error: error.message });
                return of(null);
              })
            )
          )
        )
      ),
    })
  )
);
