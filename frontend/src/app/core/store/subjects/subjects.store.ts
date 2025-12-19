import { inject } from '@angular/core';
import { signalStore, withState, withMethods, patchState, withComputed } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, tap, switchMap, catchError, of, exhaustMap, filter } from 'rxjs';
import { SubjectsService } from '../../services/api/subjects/subjects.service';
import { Subject } from '../../models/subject';
import { UserStore } from '../user/user.store';
import { computed } from '@angular/core';

export interface SubjectsState {
  subjects: Subject[];
  isLoading: boolean;
  error: string | null;
}

const initialState: SubjectsState = {
  subjects: [],
  isLoading: false,
  error: null,
};

export const SubjectsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store, userStore = inject(UserStore)) => ({
    subjectsWithSubscriptionStatus: computed(() => {
      const subjects = store.subjects();
      const user = userStore.user();
      const subscriptions = new Set(user?.subscribedSubjects?.map((s) => s.id) || []);

      return subjects.map((subject) => ({
        ...subject,
        isSubscribed: subscriptions.has(subject.id),
      }));
    }),
  })),
  withMethods((store, subjectsService = inject(SubjectsService)) => ({
    fetchAllSubjects: rxMethod<void>(
      pipe(
        filter(() => store.subjects().length === 0 || !!store.error()),
        tap(() => patchState(store, { isLoading: true, error: null })),
        exhaustMap(() =>
          subjectsService.getAllSubjects().pipe(
            tap((subjects) => patchState(store, { subjects, isLoading: false })),
            catchError((error) => {
              patchState(store, { isLoading: false, error: error.message });
              return of([]);
            })
          )
        )
      )
    ),
  }))
);
