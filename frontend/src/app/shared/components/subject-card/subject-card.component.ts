import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subject } from '@models/post';
import { UserStore } from '@store/user/user.store';

@Component({
  selector: 'app-subject-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <article class="card card-lift relative flex h-full flex-col gap-4 p-4 md:p-6">
      <div class="flex items-start justify-between gap-3">
        <span class="icon-tile font-mono text-sm font-semibold" aria-hidden="true">{{
          subject().shortName
        }}</span>
        <button
          type="button"
          class="btn btn-sm relative z-10 min-h-10"
          [class]="following() ? 'btn-secondary' : 'btn-primary'"
          [attr.aria-pressed]="following()"
          (click)="user.toggleFollow(subject())"
        >
          @if (following()) {
            <i class="ph-bold ph-check" aria-hidden="true"></i>
            Suivi
          } @else {
            <i class="ph-bold ph-plus" aria-hidden="true"></i>
            Suivre
          }
        </button>
      </div>

      <div class="flex flex-col gap-1">
        <h3 class="text-lg font-semibold text-fg">
          <a
            [routerLink]="['/subjects', subject().id]"
            class="after:absolute after:inset-0 after:content-[''] focus-visible:after:rounded-lg"
            >{{ subject().title }}</a
          >
        </h3>
        <p class="line-clamp-3 text-base text-muted">{{ subject().description }}</p>
      </div>

      <p class="mt-auto flex items-center gap-4 font-mono text-[13px] text-subtle tabular-nums">
        <span class="flex items-center gap-1">
          <i class="ph ph-users" aria-hidden="true"></i>
          {{ subject().followerCount ?? 0 }}
          {{ (subject().followerCount ?? 0) > 1 ? 'abonnés' : 'abonné' }}
        </span>
        <span class="flex items-center gap-1">
          <i class="ph ph-article" aria-hidden="true"></i>
          {{ subject().postCount ?? 0 }}
          {{ (subject().postCount ?? 0) > 1 ? 'articles' : 'article' }}
        </span>
      </p>
    </article>
  `,
})
export class SubjectCardComponent {
  readonly subject = input.required<Subject>();
  protected readonly user = inject(UserStore);

  protected readonly following = computed(() => this.user.subscribedIds().has(this.subject().id));
}
