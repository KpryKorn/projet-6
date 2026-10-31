import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  signal,
  untracked,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { AvatarComponent } from '@components/avatar/avatar.component';
import { EmptyStateComponent } from '@components/empty-state/empty-state.component';
import { PostListComponent } from '@components/post-list/post-list.component';
import { SubjectBadgeComponent } from '@components/subject-badge/subject-badge.component';
import { Profile } from '@models/user';
import { UserService } from '@services/user/user.service';
import { UserStore } from '@store/user/user.store';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-public-profile-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    AvatarComponent,
    EmptyStateComponent,
    PostListComponent,
    SubjectBadgeComponent,
  ],
  template: `
    <section class="page-in container-page max-w-3xl py-8 md:py-12">
      @if (profile(); as p) {
        <header class="flex flex-col gap-6 sm:flex-row sm:items-center">
          <app-avatar [username]="p.username" size="xl" />
          <div class="flex min-w-0 flex-1 flex-col gap-2">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <h1 class="text-3xl font-semibold text-fg">{{ p.username }}</h1>
              @if (p.id === user.me()?.id) {
                <a routerLink="/profile" class="btn btn-secondary btn-sm">
                  <i class="ph ph-gear" aria-hidden="true"></i>
                  Modifier mon profil
                </a>
              }
            </div>
            <p class="text-base text-muted">
              {{ p.bio || 'Cette personne n’a pas encore écrit de présentation.' }}
            </p>
            <p class="text-sm text-subtle">Membre depuis {{ memberSince(p.createdAt) }}</p>
          </div>
        </header>

        <dl class="mt-8 grid grid-cols-3 gap-4">
          <div class="card p-4 text-center">
            <dd class="text-2xl font-semibold text-fg tabular-nums">{{ p.postCount }}</dd>
            <dt class="text-sm text-muted">{{ p.postCount > 1 ? 'Articles' : 'Article' }}</dt>
          </div>
          <div class="card p-4 text-center">
            <dd class="text-2xl font-semibold text-fg tabular-nums">{{ p.commentCount }}</dd>
            <dt class="text-sm text-muted">
              {{ p.commentCount > 1 ? 'Commentaires' : 'Commentaire' }}
            </dt>
          </div>
          <div class="card p-4 text-center">
            <dd class="text-2xl font-semibold text-fg tabular-nums">{{ p.usefulReceived }}</dd>
            <dt class="text-sm text-muted">
              {{ p.usefulReceived > 1 ? 'Mentions utiles' : 'Mention utile' }}
            </dt>
          </div>
        </dl>

        @if (p.subjects.length > 0) {
          <div class="mt-8">
            <h2 class="text-base font-semibold text-fg">Thèmes suivis</h2>
            <ul class="mt-3 flex flex-wrap gap-2">
              @for (subject of p.subjects; track subject.id) {
                <li>
                  <a [routerLink]="['/subjects', subject.id]">
                    <app-subject-badge [title]="subject.title" />
                  </a>
                </li>
              }
            </ul>
          </div>
        }

        <h2 class="mt-12 mb-4 text-xl font-semibold text-fg">Articles publiés</h2>
        <app-post-list
          scope="all"
          [authorId]="p.id"
          emptyTitle="Aucun article publié"
          emptyDescription="Cette personne n’a pas encore partagé d’article."
        />
      } @else if (failed()) {
        <app-empty-state
          icon="ph ph-user-circle-dashed"
          title="Ce profil est introuvable"
          description="Le compte n’existe plus, ou le lien est incorrect."
        >
          <a routerLink="/feed" class="btn btn-primary">Retour au fil</a>
        </app-empty-state>
      } @else {
        <div class="flex animate-pulse items-center gap-6" aria-busy="true">
          <div class="size-20 rounded-full bg-surface-3"></div>
          <div class="flex flex-1 flex-col gap-2">
            <div class="h-8 w-48 rounded-lg bg-surface-3"></div>
            <div class="h-4 w-full rounded-lg bg-surface-2"></div>
          </div>
        </div>
      }
    </section>
  `,
})
export class PublicProfilePage {
  readonly id = input.required<string>();

  private readonly service = inject(UserService);
  protected readonly user = inject(UserStore);

  protected readonly profile = signal<Profile | null>(null);
  protected readonly failed = signal(false);

  protected memberSince(iso: string): string {
    return new Intl.DateTimeFormat('fr', { month: 'long', year: 'numeric' }).format(new Date(iso));
  }

  constructor() {
    effect(() => {
      const id = Number(this.id());
      untracked(() => {
        this.profile.set(null);
        this.failed.set(false);
        firstValueFrom(this.service.profile(id))
          .then((profile) => this.profile.set(profile))
          .catch(() => this.failed.set(true));
      });
    });
  }
}
