import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { AvatarComponent } from '@components/avatar/avatar.component';
import { SubjectBadgeComponent } from '@components/subject-badge/subject-badge.component';
import { Post } from '@models/post';
import { TimeAgoPipe } from '@pipes/time-ago.pipe';
import { PostService } from '@services/post/post.service';
import { ToastService } from '@services/toast/toast.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-post-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, TimeAgoPipe, AvatarComponent, SubjectBadgeComponent],
  template: `
    <article class="card card-lift relative flex flex-col gap-3 p-5 md:p-6">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <a
          [routerLink]="['/u', post().author.id]"
          class="relative z-10 flex items-center gap-2 text-sm text-muted transition-colors duration-(--dur-1) ease-out hover:text-fg"
        >
          <app-avatar [username]="post().author.username" size="sm" />
          <span class="font-medium text-fg">{{ post().author.username }}</span>
        </a>
        <app-subject-badge [title]="post().subject.title" />
      </div>

      <h3 class="text-lg font-semibold text-fg">
        <a
          [routerLink]="['/posts', post().id]"
          class="after:absolute after:inset-0 after:content-[''] focus-visible:after:rounded-lg"
          >{{ post().title }}</a
        >
      </h3>

      <p class="line-clamp-2 text-base text-muted">{{ post().excerpt }}</p>

      <div class="flex items-center justify-between gap-2">
        <div class="flex items-center gap-1">
          <button
            type="button"
            class="btn btn-ghost btn-sm relative z-10 min-h-10"
            [class.text-accent-text]="post().viewerHasReacted"
            [attr.aria-pressed]="post().viewerHasReacted"
            [attr.aria-label]="reactionLabel()"
            (click)="toggleReaction()"
          >
            <i
              class="text-lg"
              [class]="post().viewerHasReacted ? 'ph-fill ph-thumbs-up' : 'ph ph-thumbs-up'"
              [class.pop]="reactionPop()"
            ></i>
            <span class="font-mono tabular-nums">{{ post().usefulCount }}</span>
          </button>
          <span class="flex min-h-10 items-center gap-1 px-2 text-sm text-muted">
            <i class="ph ph-chat-circle text-lg" aria-hidden="true"></i>
            <span class="font-mono tabular-nums">{{ post().commentCount }}</span>
            <span class="sr-only">commentaires</span>
          </span>
        </div>

        <div class="flex items-center gap-2 font-mono text-[13px] text-subtle tabular-nums">
          <span class="hidden sm:inline">{{ post().createdAt | timeAgo }}</span>
          <span class="hidden sm:inline" aria-hidden="true">·</span>
          <span>{{ post().readingMinutes }} min</span>
          <button
            type="button"
            class="btn btn-ghost btn-sm relative z-10 min-h-10"
            [class.text-accent-text]="post().viewerHasBookmarked"
            [attr.aria-pressed]="post().viewerHasBookmarked"
            [attr.aria-label]="
              post().viewerHasBookmarked ? 'Retirer des enregistrés' : 'Enregistrer l’article'
            "
            (click)="toggleBookmark()"
          >
            <i
              class="text-lg"
              [class]="
                post().viewerHasBookmarked ? 'ph-fill ph-bookmark-simple' : 'ph ph-bookmark-simple'
              "
              [class.pop]="bookmarkPop()"
            ></i>
          </button>
        </div>
      </div>
    </article>
  `,
})
export class PostCardComponent {
  readonly post = input.required<Post>();
  readonly postChange = output<Post>();

  private readonly service = inject(PostService);
  private readonly toast = inject(ToastService);

  protected readonly reactionPop = signal(false);
  protected readonly bookmarkPop = signal(false);

  protected readonly reactionLabel = computed(() =>
    this.post().viewerHasReacted ? 'Retirer la mention utile' : 'Marquer comme utile',
  );

  /** Optimistic: the count moves immediately and the server answer settles it. */
  protected async toggleReaction(): Promise<void> {
    const before = this.post();
    const next = !before.viewerHasReacted;
    this.postChange.emit({
      ...before,
      viewerHasReacted: next,
      usefulCount: before.usefulCount + (next ? 1 : -1),
    });
    this.flash(this.reactionPop);
    try {
      const result = await firstValueFrom(
        next ? this.service.react(before.id) : this.service.unreact(before.id),
      );
      this.postChange.emit({ ...this.post(), ...result });
    } catch {
      this.postChange.emit(before);
      this.toast.error('Ta mention utile n’a pas pu être enregistrée. Réessaie dans un instant.');
    }
  }

  protected async toggleBookmark(): Promise<void> {
    const before = this.post();
    const next = !before.viewerHasBookmarked;
    this.postChange.emit({ ...before, viewerHasBookmarked: next });
    this.flash(this.bookmarkPop);
    try {
      await firstValueFrom(
        next ? this.service.bookmark(before.id) : this.service.unbookmark(before.id),
      );
      if (next) this.toast.success('Article enregistré. Il apparaît dans l’onglet Enregistrés.');
    } catch {
      this.postChange.emit(before);
      this.toast.error('L’enregistrement a échoué. Réessaie dans un instant.');
    }
  }

  private flash(target: ReturnType<typeof signal<boolean>>): void {
    target.set(true);
    setTimeout(() => target.set(false), 400);
  }
}
