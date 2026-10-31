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
import { Title } from '@angular/platform-browser';
import { Router, RouterLink } from '@angular/router';
import { AvatarComponent } from '@components/avatar/avatar.component';
import { EmptyStateComponent } from '@components/empty-state/empty-state.component';
import { MarkdownContentComponent } from '@components/markdown/markdown.component';
import { SubjectBadgeComponent } from '@components/subject-badge/subject-badge.component';
import { Comment } from '@models/comment';
import { Post } from '@models/post';
import { TimeAgoPipe } from '@pipes/time-ago.pipe';
import { ConfirmService } from '@services/confirm/confirm.service';
import { PostService } from '@services/post/post.service';
import { ToastService } from '@services/toast/toast.service';
import { UserStore } from '@store/user/user.store';
import { errorMessage } from '@utils/errors';
import { firstValueFrom } from 'rxjs';

const MAX_COMMENT = 2000;

@Component({
  selector: 'app-post-detail-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    TimeAgoPipe,
    AvatarComponent,
    EmptyStateComponent,
    MarkdownContentComponent,
    SubjectBadgeComponent,
  ],
  host: { '(window:scroll)': 'onScroll()' },
  template: `
    <div
      class="fixed inset-x-0 top-0 z-50 h-1 origin-left bg-accent"
      [style.transform]="'scaleX(' + progress() + ')'"
      role="progressbar"
      aria-label="Progression de la lecture"
      [attr.aria-valuenow]="Math.round(progress() * 100)"
      aria-valuemin="0"
      aria-valuemax="100"
    ></div>

    <section class="page-in container-page max-w-3xl py-8 md:py-12">
      <a
        routerLink="/feed"
        class="inline-flex items-center gap-1 text-sm text-muted transition-colors duration-(--dur-1) ease-out hover:text-fg"
      >
        <i class="ph ph-arrow-left" aria-hidden="true"></i>
        Retour au fil
      </a>

      @if (post(); as p) {
        <article class="mt-6">
          <header class="flex flex-col gap-4">
            <div class="flex items-center gap-2">
              <a [routerLink]="['/subjects', p.subject.id]">
                <app-subject-badge [title]="p.subject.title" />
              </a>
              <span class="text-sm text-subtle">{{ p.readingMinutes }} min de lecture</span>
            </div>
            <h1 class="text-3xl font-semibold text-fg md:text-4xl">{{ p.title }}</h1>

            <div class="flex flex-wrap items-center justify-between gap-4">
              <a [routerLink]="['/u', p.author.id]" class="flex items-center gap-3">
                <app-avatar [username]="p.author.username" size="lg" />
                <span class="flex flex-col">
                  <span class="text-base font-semibold text-fg">{{ p.author.username }}</span>
                  <span class="text-sm text-subtle">{{ p.createdAt | timeAgo }}</span>
                </span>
              </a>

              @if (isAuthor()) {
                <div class="flex items-center gap-2">
                  <a [routerLink]="['/posts', p.id, 'edit']" class="btn btn-secondary btn-sm">
                    <i class="ph ph-pencil-simple" aria-hidden="true"></i>
                    Modifier
                  </a>
                  <button type="button" class="btn btn-danger btn-sm" (click)="remove(p)">
                    <i class="ph ph-trash" aria-hidden="true"></i>
                    Supprimer
                  </button>
                </div>
              }
            </div>
          </header>

          <div class="mt-8">
            <app-markdown [source]="p.content ?? ''" />
          </div>

          <div
            class="mt-12 flex flex-wrap items-center gap-2 rounded-lg border border-line-strong bg-surface p-2"
          >
            <button
              type="button"
              class="btn btn-sm min-h-10"
              [class]="p.viewerHasReacted ? 'btn-secondary text-accent-text' : 'btn-ghost'"
              [attr.aria-pressed]="p.viewerHasReacted"
              (click)="toggleReaction()"
            >
              <i
                class="text-lg"
                [class]="p.viewerHasReacted ? 'ph-fill ph-thumbs-up' : 'ph ph-thumbs-up'"
                [class.pop]="pop()"
                aria-hidden="true"
              ></i>
              Utile
              <span class="tabular-nums">{{ p.usefulCount }}</span>
            </button>
            <button
              type="button"
              class="btn btn-sm min-h-10"
              [class]="p.viewerHasBookmarked ? 'btn-secondary text-accent-text' : 'btn-ghost'"
              [attr.aria-pressed]="p.viewerHasBookmarked"
              (click)="toggleBookmark()"
            >
              <i
                class="text-lg"
                [class]="
                  p.viewerHasBookmarked ? 'ph-fill ph-bookmark-simple' : 'ph ph-bookmark-simple'
                "
                aria-hidden="true"
              ></i>
              {{ p.viewerHasBookmarked ? 'Enregistré' : 'Enregistrer' }}
            </button>
            <button type="button" class="btn btn-ghost btn-sm min-h-10" (click)="share()">
              <i class="ph ph-link text-lg" aria-hidden="true"></i>
              Copier le lien
            </button>
          </div>
        </article>

        <section class="mt-12" aria-labelledby="comments-title">
          <h2 id="comments-title" class="text-xl font-semibold text-fg">
            {{ comments().length }} {{ comments().length > 1 ? 'commentaires' : 'commentaire' }}
          </h2>

          <form class="mt-6 flex flex-col gap-2" (submit)="$event.preventDefault(); send()">
            <label for="comment" class="sr-only">Ton commentaire</label>
            <textarea
              id="comment"
              class="field min-h-24 resize-y"
              rows="3"
              placeholder="Une remarque, une question, un retour d’expérience…"
              [value]="draft()"
              (input)="draft.set($any($event.target).value)"
              (keydown.meta.enter)="send()"
              (keydown.control.enter)="send()"
              [attr.maxlength]="maxComment"
            ></textarea>
            <div class="flex items-center justify-between gap-4">
              <span class="text-sm text-subtle">
                <span class="tabular-nums">{{ draft().length }}</span> / {{ maxComment }}
                <span class="hidden sm:inline"> · Cmd ou Ctrl plus Entrée pour envoyer</span>
              </span>
              <button type="submit" class="btn btn-primary btn-sm" [disabled]="!canSend()">
                @if (sending()) {
                  <i class="ph ph-circle-notch animate-spin" aria-hidden="true"></i>
                }
                Commenter
              </button>
            </div>
          </form>

          <ul class="mt-8 flex flex-col gap-6">
            @for (comment of comments(); track comment.id) {
              <li class="flex gap-3">
                <a [routerLink]="['/u', comment.author.id]" class="shrink-0">
                  <app-avatar [username]="comment.author.username" />
                </a>
                <div class="min-w-0 flex-1">
                  <div class="flex items-center gap-2 text-sm">
                    <a
                      [routerLink]="['/u', comment.author.id]"
                      class="font-semibold text-fg hover:text-accent-text"
                      >{{ comment.author.username }}</a
                    >
                    <span class="text-subtle">{{ comment.createdAt | timeAgo }}</span>
                    @if (comment.author.id === user.me()?.id) {
                      <button
                        type="button"
                        class="ml-auto text-subtle transition-colors duration-(--dur-1) ease-out hover:text-danger"
                        aria-label="Supprimer mon commentaire"
                        (click)="removeComment(comment)"
                      >
                        <i class="ph ph-trash" aria-hidden="true"></i>
                      </button>
                    }
                  </div>
                  <div class="mt-1"><app-markdown [source]="comment.content" /></div>
                </div>
              </li>
            } @empty {
              <li class="text-base text-muted">
                Personne n’a encore commenté. Lance la discussion.
              </li>
            }
          </ul>
        </section>
      } @else if (failed()) {
        <div class="mt-8">
          <app-empty-state
            icon="ph ph-file-x"
            title="Cet article est introuvable"
            description="Il a peut-être été supprimé par son auteur, ou le lien est incorrect."
          >
            <a routerLink="/feed" class="btn btn-primary">Retour au fil</a>
          </app-empty-state>
        </div>
      } @else {
        <div class="mt-8 flex animate-pulse flex-col gap-4" aria-busy="true">
          <div class="h-6 w-24 rounded-full bg-surface-3"></div>
          <div class="h-10 w-3/4 rounded-lg bg-surface-3"></div>
          <div class="h-4 w-full rounded-lg bg-surface-2"></div>
          <div class="h-4 w-full rounded-lg bg-surface-2"></div>
          <div class="h-4 w-2/3 rounded-lg bg-surface-2"></div>
        </div>
      }
    </section>
  `,
})
export class PostDetailPage {
  readonly id = input.required<string>();

  protected readonly Math = Math;
  protected readonly maxComment = MAX_COMMENT;
  protected readonly user = inject(UserStore);
  private readonly service = inject(PostService);
  private readonly toast = inject(ToastService);
  private readonly confirm = inject(ConfirmService);
  private readonly router = inject(Router);
  private readonly title = inject(Title);

  protected readonly post = signal<Post | null>(null);
  protected readonly comments = signal<Comment[]>([]);
  protected readonly failed = signal(false);
  protected readonly progress = signal(0);
  protected readonly pop = signal(false);
  protected readonly draft = signal('');
  protected readonly sending = signal(false);

  protected readonly isAuthor = computed(() => {
    const post = this.post();
    return !!post && post.author.id === this.user.me()?.id;
  });
  protected readonly canSend = computed(
    () => this.draft().trim().length > 0 && this.draft().length <= MAX_COMMENT && !this.sending(),
  );

  private frame = 0;

  constructor() {
    effect(() => {
      const id = Number(this.id());
      untracked(() => void this.load(id));
    });
  }

  protected onScroll(): void {
    if (this.frame) return;
    this.frame = requestAnimationFrame(() => {
      this.frame = 0;
      const root = document.documentElement;
      const max = root.scrollHeight - root.clientHeight;
      this.progress.set(max > 0 ? Math.min(1, root.scrollTop / max) : 0);
    });
  }

  private async load(id: number): Promise<void> {
    this.post.set(null);
    this.comments.set([]);
    this.failed.set(false);
    try {
      const [post, comments] = await Promise.all([
        firstValueFrom(this.service.get(id)),
        firstValueFrom(this.service.comments(id)),
      ]);
      this.post.set(post);
      this.comments.set(comments);
      this.title.setTitle(`${post.title} · MDD`);
    } catch {
      this.failed.set(true);
    }
  }

  protected async toggleReaction(): Promise<void> {
    const before = this.post();
    if (!before) return;
    const next = !before.viewerHasReacted;
    this.post.set({
      ...before,
      viewerHasReacted: next,
      usefulCount: before.usefulCount + (next ? 1 : -1),
    });
    this.pop.set(true);
    setTimeout(() => this.pop.set(false), 400);
    try {
      const result = await firstValueFrom(
        next ? this.service.react(before.id) : this.service.unreact(before.id),
      );
      this.post.update((post) => (post ? { ...post, ...result } : post));
    } catch {
      this.post.set(before);
      this.toast.error('Ta mention utile n’a pas pu être enregistrée. Réessaie dans un instant.');
    }
  }

  protected async toggleBookmark(): Promise<void> {
    const before = this.post();
    if (!before) return;
    const next = !before.viewerHasBookmarked;
    this.post.set({ ...before, viewerHasBookmarked: next });
    try {
      await firstValueFrom(
        next ? this.service.bookmark(before.id) : this.service.unbookmark(before.id),
      );
      this.toast.success(next ? 'Article enregistré.' : 'Article retiré de tes enregistrés.');
    } catch {
      this.post.set(before);
      this.toast.error('L’enregistrement a échoué. Réessaie dans un instant.');
    }
  }

  protected async share(): Promise<void> {
    try {
      await navigator.clipboard.writeText(window.location.href);
      this.toast.success('Lien copié dans le presse-papiers.');
    } catch {
      this.toast.error(
        'Impossible de copier le lien. Copie l’adresse depuis la barre du navigateur.',
      );
    }
  }

  protected async remove(post: Post): Promise<void> {
    const confirmed = await this.confirm.ask({
      title: 'Supprimer cet article ?',
      message: 'L’article et ses commentaires seront supprimés définitivement.',
      confirmLabel: 'Supprimer',
      danger: true,
    });
    if (!confirmed) return;
    try {
      await firstValueFrom(this.service.remove(post.id));
      this.toast.success('Article supprimé.');
      await this.router.navigateByUrl('/feed');
    } catch (err) {
      this.toast.error(errorMessage(err, 'La suppression a échoué. Réessaie dans un instant.'));
    }
  }

  protected async send(): Promise<void> {
    const post = this.post();
    if (!post || !this.canSend()) return;
    this.sending.set(true);
    try {
      const comment = await firstValueFrom(
        this.service.addComment({ content: this.draft().trim(), postId: post.id }),
      );
      this.comments.update((list) => [...list, comment]);
      this.post.update((p) => (p ? { ...p, commentCount: p.commentCount + 1 } : p));
      this.draft.set('');
    } catch (err) {
      this.toast.error(
        errorMessage(err, 'Le commentaire n’a pas pu être publié. Réessaie dans un instant.'),
      );
    } finally {
      this.sending.set(false);
    }
  }

  protected async removeComment(comment: Comment): Promise<void> {
    const confirmed = await this.confirm.ask({
      title: 'Supprimer ce commentaire ?',
      message: 'Cette action est définitive.',
      confirmLabel: 'Supprimer',
      danger: true,
    });
    if (!confirmed) return;
    try {
      await firstValueFrom(this.service.removeComment(comment.id));
      this.comments.update((list) => list.filter((c) => c.id !== comment.id));
      this.post.update((p) => (p ? { ...p, commentCount: Math.max(0, p.commentCount - 1) } : p));
    } catch (err) {
      this.toast.error(errorMessage(err, 'La suppression a échoué. Réessaie dans un instant.'));
    }
  }
}
