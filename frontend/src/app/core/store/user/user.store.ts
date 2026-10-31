import { computed, inject } from '@angular/core';
import { Subject } from '@models/post';
import { Me, ProfileUpdate } from '@models/user';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { SubjectsService } from '@services/subjects/subjects.service';
import { ToastService } from '@services/toast/toast.service';
import { UserService } from '@services/user/user.service';
import { SubjectsStore } from '@store/subjects/subjects.store';
import { firstValueFrom } from 'rxjs';

interface UserState {
  me: Me | null;
  status: 'idle' | 'loading' | 'loaded' | 'error';
}

export const UserStore = signalStore(
  { providedIn: 'root' },
  withState<UserState>({ me: null, status: 'idle' }),
  withComputed(({ me }) => ({
    subscriptions: computed(() => me()?.subscribedSubjects ?? []),
    subscribedIds: computed(() => new Set((me()?.subscribedSubjects ?? []).map((s) => s.id))),
  })),
  withMethods(
    (
      store,
      userService = inject(UserService),
      subjectsService = inject(SubjectsService),
      subjectsStore = inject(SubjectsStore),
      toast = inject(ToastService),
    ) => {
      const setSubscriptions = (subjects: Subject[]) => {
        const me = store.me();
        if (me) patchState(store, { me: { ...me, subscribedSubjects: subjects } });
      };

      return {
        async load(): Promise<void> {
          patchState(store, { status: 'loading' });
          try {
            patchState(store, { me: await firstValueFrom(userService.me()), status: 'loaded' });
          } catch {
            patchState(store, { status: 'error' });
          }
        },

        clear(): void {
          patchState(store, { me: null, status: 'idle' });
        },

        isFollowing(subjectId: number): boolean {
          return store.subscribedIds().has(subjectId);
        },

        /** Optimistic: the interface reacts at once and rolls back if the server refuses. */
        async toggleFollow(subject: Subject): Promise<void> {
          const before = store.subscriptions();
          const following = store.subscribedIds().has(subject.id);
          setSubscriptions(
            following ? before.filter((s) => s.id !== subject.id) : [...before, subject],
          );
          subjectsStore.adjustFollowers(subject.id, following ? -1 : 1);
          try {
            await firstValueFrom(
              following
                ? subjectsService.unsubscribe(subject.id)
                : subjectsService.subscribe(subject.id),
            );
            if (!following) toast.success(`Tu suis maintenant ${subject.title}.`);
          } catch {
            setSubscriptions(before);
            subjectsStore.adjustFollowers(subject.id, following ? 1 : -1);
            toast.error(`L’abonnement à ${subject.title} a échoué. Réessaie dans un instant.`);
          }
        },

        async update(changes: ProfileUpdate): Promise<Me> {
          const me = await firstValueFrom(userService.updateMe(changes));
          patchState(store, { me });
          return me;
        },
      };
    },
  ),
);
