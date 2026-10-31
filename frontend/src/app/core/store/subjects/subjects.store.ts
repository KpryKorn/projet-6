import { inject } from '@angular/core';
import { Subject } from '@models/post';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { SubjectsService } from '@services/subjects/subjects.service';
import { firstValueFrom } from 'rxjs';

interface SubjectsState {
  subjects: Subject[];
  status: 'idle' | 'loading' | 'loaded' | 'error';
}

export const SubjectsStore = signalStore(
  { providedIn: 'root' },
  withState<SubjectsState>({ subjects: [], status: 'idle' }),
  withMethods((store, service = inject(SubjectsService)) => ({
    async load(force = false): Promise<void> {
      if (store.status() === 'loading' || (store.status() === 'loaded' && !force)) return;
      patchState(store, { status: 'loading' });
      try {
        patchState(store, { subjects: await firstValueFrom(service.list()), status: 'loaded' });
      } catch {
        patchState(store, { status: 'error' });
      }
    },

    adjustFollowers(subjectId: number, delta: number): void {
      patchState(store, {
        subjects: store
          .subjects()
          .map((subject) =>
            subject.id === subjectId
              ? { ...subject, followerCount: Math.max(0, (subject.followerCount ?? 0) + delta) }
              : subject,
          ),
      });
    },

    byId(id: number): Subject | undefined {
      return store.subjects().find((subject) => subject.id === id);
    },
  })),
);
