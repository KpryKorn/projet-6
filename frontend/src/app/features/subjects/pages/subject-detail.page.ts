import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
  untracked,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { EmptyStateComponent } from '@components/empty-state/empty-state.component';
import { PostListComponent } from '@components/post-list/post-list.component';
import { Subject } from '@models/post';
import { SubjectsService } from '@services/subjects/subjects.service';
import { UserStore } from '@store/user/user.store';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-subject-detail-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, EmptyStateComponent, PostListComponent],
  template: `
    <section class="page-in container-page py-8 md:py-12">
      <a
        routerLink="/subjects"
        class="inline-flex items-center gap-1 text-sm text-muted transition-colors duration-(--dur-1) ease-out hover:text-fg"
      >
        <i class="ph ph-arrow-left" aria-hidden="true"></i>
        Tous les thèmes
      </a>

      @if (subject(); as s) {
        <header class="mt-6 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div class="flex items-center gap-4">
            <span class="icon-tile size-14 font-mono text-lg font-semibold" aria-hidden="true">{{
              s.shortName
            }}</span>
            <div>
              <h1 class="text-3xl font-semibold text-fg">{{ s.title }}</h1>
              <p
                class="mt-1 flex items-center gap-4 font-mono text-[13px] text-subtle tabular-nums"
              >
                <span
                  >{{ s.followerCount ?? 0 }}
                  {{ (s.followerCount ?? 0) > 1 ? 'abonnés' : 'abonné' }}</span
                >
                <span
                  >{{ s.postCount ?? 0 }}
                  {{ (s.postCount ?? 0) > 1 ? 'articles' : 'article' }}</span
                >
              </p>
            </div>
          </div>
          <button
            type="button"
            class="btn"
            [class]="following() ? 'btn-secondary' : 'btn-primary'"
            [attr.aria-pressed]="following()"
            (click)="toggle(s)"
          >
            @if (following()) {
              <i class="ph-bold ph-check" aria-hidden="true"></i>
              Tu suis ce thème
            } @else {
              <i class="ph-bold ph-plus" aria-hidden="true"></i>
              Suivre ce thème
            }
          </button>
        </header>
        <p class="mt-6 max-w-2xl text-base text-muted">{{ s.description }}</p>

        <h2 class="mt-12 mb-4 text-xl font-semibold text-fg">Derniers articles</h2>
        <app-post-list
          scope="all"
          [subjectId]="s.id"
          emptyTitle="Aucun article sur ce thème"
          emptyDescription="Personne n’a encore écrit sur ce thème. Tu peux être le premier."
        >
          <a routerLink="/posts/new" [queryParams]="{ subject: s.id }" class="btn btn-primary"
            >Écrire un article</a
          >
        </app-post-list>
      } @else if (failed()) {
        <div class="mt-8">
          <app-empty-state
            icon="ph ph-compass"
            title="Ce thème n’existe pas"
            description="Il a peut-être été supprimé, ou le lien est incorrect."
          >
            <a routerLink="/subjects" class="btn btn-primary">Voir tous les thèmes</a>
          </app-empty-state>
        </div>
      } @else {
        <div class="mt-8 h-24 animate-pulse rounded-lg bg-surface-2" aria-busy="true"></div>
      }
    </section>
  `,
})
export class SubjectDetailPage {
  readonly id = input.required<string>();

  private readonly service = inject(SubjectsService);
  private readonly user = inject(UserStore);

  protected readonly subject = signal<Subject | null>(null);
  protected readonly failed = signal(false);
  protected readonly following = computed(() => {
    const current = this.subject();
    return !!current && this.user.subscribedIds().has(current.id);
  });

  constructor() {
    effect(() => {
      const id = Number(this.id());
      untracked(() => {
        this.subject.set(null);
        this.failed.set(false);
        firstValueFrom(this.service.get(id))
          .then((subject) => this.subject.set(subject))
          .catch(() => this.failed.set(true));
      });
    });
  }

  protected async toggle(subject: Subject): Promise<void> {
    const wasFollowing = this.following();
    this.subject.set({
      ...subject,
      followerCount: Math.max(0, (subject.followerCount ?? 0) + (wasFollowing ? -1 : 1)),
    });
    await this.user.toggleFollow(subject);
    // A rolled back follow leaves the store out of step with the optimistic count, so it is restored here.
    if (this.following() === wasFollowing) this.subject.set(subject);
  }
}
