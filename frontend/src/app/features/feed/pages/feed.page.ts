import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnDestroy,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { PostListComponent } from '@components/post-list/post-list.component';
import { SubjectBadgeComponent } from '@components/subject-badge/subject-badge.component';
import { FeedScope, Post } from '@models/post';
import { PostService } from '@services/post/post.service';
import { UserStore } from '@store/user/user.store';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-feed-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, PostListComponent, SubjectBadgeComponent],
  template: `
    <section class="page-in container-page py-8 md:py-12">
      <header class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p class="eyebrow">Ton fil</p>
          <h1 class="mt-1 text-3xl font-semibold text-fg">
            Salut{{ user.me() ? ' ' + user.me()!.username : '' }}
          </h1>
        </div>
        <a routerLink="/posts/new" class="btn btn-primary self-start md:self-auto">
          <i class="ph-bold ph-pencil-simple-line" aria-hidden="true"></i>
          Écrire un article
        </a>
      </header>

      <div class="mt-8 grid gap-8 lg:grid-cols-[1fr_20rem]">
        <div class="min-w-0">
          <div class="flex flex-col gap-4">
            <div
              class="no-scrollbar flex gap-1 overflow-x-auto border-b border-line"
              role="tablist"
              aria-label="Type de fil"
            >
              @for (tab of tabs; track tab.scope) {
                <button
                  type="button"
                  role="tab"
                  class="tab inline-flex shrink-0 items-center gap-2"
                  [attr.aria-selected]="scope() === tab.scope"
                  (click)="selectScope(tab.scope)"
                >
                  <i [class]="tab.icon" aria-hidden="true"></i>
                  {{ tab.label }}
                </button>
              }
            </div>

            <div class="relative">
              <i
                class="ph ph-magnifying-glass pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-subtle"
                aria-hidden="true"
              ></i>
              <input
                type="search"
                class="field pl-10"
                placeholder="Rechercher un article"
                aria-label="Rechercher dans les articles"
                [value]="searchInput()"
                (input)="onSearch($any($event.target).value)"
              />
            </div>

            @if (scope() !== 'saved' && user.subscriptions().length > 0) {
              <div
                class="no-scrollbar flex gap-2 overflow-x-auto pb-1"
                role="group"
                aria-label="Filtrer par thème"
              >
                <button
                  type="button"
                  class="chip h-7 shrink-0"
                  [class]="subjectId() === null ? 'border-fg bg-fg text-bg' : 'bg-surface'"
                  [attr.aria-pressed]="subjectId() === null"
                  (click)="subjectId.set(null)"
                >
                  Tous
                </button>
                @for (subject of user.subscriptions(); track subject.id) {
                  <button
                    type="button"
                    class="chip h-7 shrink-0"
                    [class]="subjectId() === subject.id ? 'border-fg bg-fg text-bg' : 'bg-surface'"
                    [attr.aria-pressed]="subjectId() === subject.id"
                    (click)="subjectId.set(subject.id)"
                  >
                    {{ subject.title }}
                  </button>
                }
              </div>
            }
          </div>

          <div class="mt-6">
            <app-post-list
              [scope]="scope()"
              [query]="query()"
              [subjectId]="subjectId()"
              [emptyIcon]="empty().icon"
              [emptyTitle]="empty().title"
              [emptyDescription]="empty().description"
            >
              @if (query() || subjectId() !== null) {
                <button type="button" class="btn btn-secondary" (click)="clearFilters()">
                  Réinitialiser les filtres
                </button>
              } @else if (scope() === 'subscribed') {
                @if (user.subscriptions().length === 0) {
                  <a routerLink="/subjects" class="btn btn-primary">Choisir des thèmes</a>
                } @else {
                  <button type="button" class="btn btn-secondary" (click)="selectScope('all')">
                    Découvrir d’autres articles
                  </button>
                }
              } @else if (scope() === 'saved') {
                <button type="button" class="btn btn-secondary" (click)="selectScope('all')">
                  Parcourir les articles
                </button>
              }
            </app-post-list>
          </div>
        </div>

        <aside class="hidden lg:block" aria-label="À lire en ce moment">
          <div class="card sticky top-20 p-4">
            <h2 class="flex items-center gap-2 text-base font-semibold text-fg">
              <i class="ph-fill ph-fire text-accent-text" aria-hidden="true"></i>
              À lire en ce moment
            </h2>
            <ol class="mt-4 flex flex-col gap-4">
              @for (post of trending(); track post.id; let i = $index) {
                <li class="flex gap-3">
                  <span class="font-mono text-sm text-subtle">0{{ i + 1 }}</span>
                  <div class="flex min-w-0 flex-col gap-1">
                    <a
                      [routerLink]="['/posts', post.id]"
                      class="line-clamp-2 text-sm font-medium text-fg transition-colors duration-(--dur-1) ease-out hover:text-accent-text"
                      >{{ post.title }}</a
                    >
                    <div class="flex items-center gap-2">
                      <app-subject-badge [title]="post.subject.title" />
                      <span class="font-mono text-xs text-subtle tabular-nums"
                        >{{ post.usefulCount }}
                        {{ post.usefulCount > 1 ? 'mentions utiles' : 'mention utile' }}</span
                      >
                    </div>
                  </div>
                </li>
              } @empty {
                <li class="text-sm text-subtle">Rien d’épinglé cette semaine pour l’instant.</li>
              }
            </ol>
          </div>
        </aside>
      </div>
    </section>
  `,
})
export class FeedPage implements OnDestroy {
  protected readonly user = inject(UserStore);
  private readonly posts = inject(PostService);

  protected readonly tabs: { scope: FeedScope; label: string; icon: string }[] = [
    { scope: 'subscribed', label: 'Pour toi', icon: 'ph ph-sparkle' },
    { scope: 'all', label: 'Découvrir', icon: 'ph ph-compass' },
    { scope: 'saved', label: 'Enregistrés', icon: 'ph ph-bookmark-simple' },
  ];

  protected readonly scope = signal<FeedScope>('subscribed');
  protected readonly searchInput = signal('');
  protected readonly query = signal('');
  protected readonly subjectId = signal<number | null>(null);
  protected readonly trending = signal<Post[]>([]);

  protected readonly empty = computed(() => {
    if (this.query()) {
      return {
        icon: 'ph ph-magnifying-glass',
        title: 'Aucun résultat',
        description: `Rien ne correspond à « ${this.query()} ». Essaie un autre mot ou un terme plus court.`,
      };
    }
    switch (this.scope()) {
      case 'saved':
        return {
          icon: 'ph ph-bookmark-simple',
          title: 'Rien d’enregistré pour l’instant',
          description: 'Utilise le marque-page d’un article pour le retrouver ici plus tard.',
        };
      case 'subscribed':
        return this.user.subscriptions().length === 0
          ? {
              icon: 'ph ph-hash',
              title: 'Ton fil attend tes thèmes',
              description: 'Suis quelques thèmes et les articles correspondants apparaîtront ici.',
            }
          : {
              icon: 'ph ph-coffee',
              title: 'Tout est lu',
              description:
                'Pas de nouvel article sur tes thèmes. Jette un œil à Découvrir pour élargir tes lectures.',
            };
      default:
        return {
          icon: 'ph ph-newspaper',
          title: 'Aucun article pour le moment',
          description: 'Reviens dans un instant, ou publie le premier.',
        };
    }
  });

  private timer?: ReturnType<typeof setTimeout>;

  constructor() {
    firstValueFrom(this.posts.trending())
      .then((list) => this.trending.set(list))
      .catch(() => undefined);
  }

  ngOnDestroy(): void {
    clearTimeout(this.timer);
  }

  protected selectScope(scope: FeedScope): void {
    this.scope.set(scope);
    if (scope === 'saved') this.subjectId.set(null);
  }

  protected onSearch(value: string): void {
    this.searchInput.set(value);
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.query.set(value.trim()), 300);
  }

  protected clearFilters(): void {
    this.searchInput.set('');
    this.query.set('');
    this.subjectId.set(null);
  }
}
