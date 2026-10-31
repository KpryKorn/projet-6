import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  untracked,
} from '@angular/core';
import { EmptyStateComponent } from '@components/empty-state/empty-state.component';
import { PostCardComponent } from '@components/post-card/post-card.component';
import { PostSkeletonComponent } from '@components/post-skeleton/post-skeleton.component';
import { InViewDirective, RevealDirective } from '@directives/reveal.directive';
import { FeedScope, Post } from '@models/post';
import { PostListStore } from '@store/post-list/post-list.store';

/** A paginated list of posts with its own loading, error, empty and end states. */
@Component({
  selector: 'app-post-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PostCardComponent,
    PostSkeletonComponent,
    EmptyStateComponent,
    RevealDirective,
    InViewDirective,
  ],
  providers: [PostListStore],
  template: `
    @switch (store.status()) {
      @case ('loading') {
        <div class="flex flex-col gap-4" aria-busy="true" aria-label="Chargement des articles">
          @for (n of [1, 2, 3]; track n) {
            <app-post-skeleton />
          }
        </div>
      }
      @case ('error') {
        <app-empty-state
          icon="ph ph-cloud-slash"
          title="Impossible de charger les articles"
          description="Le serveur ne répond pas pour l’instant. Vérifie ta connexion puis réessaie."
        >
          <button type="button" class="btn btn-primary" (click)="store.reload()">Réessayer</button>
        </app-empty-state>
      }
      @default {
        @if (store.items().length === 0) {
          <app-empty-state
            [icon]="emptyIcon()"
            [title]="emptyTitle()"
            [description]="emptyDescription()"
          >
            <ng-content />
          </app-empty-state>
        } @else {
          <ul class="flex flex-col gap-4">
            @for (post of store.items(); track post.id) {
              <li appReveal>
                <app-post-card [post]="post" (postChange)="onChange($event)" />
              </li>
            }
          </ul>
          @if (store.hasNext()) {
            <div (appInView)="store.loadMore()" class="mt-4 flex flex-col gap-4">
              @if (store.loadingMore()) {
                <app-post-skeleton />
              }
            </div>
          } @else {
            <p class="mt-8 text-center text-sm text-subtle">Tu as tout lu pour l’instant.</p>
          }
        }
      }
    }
  `,
})
export class PostListComponent {
  readonly scope = input<FeedScope>('all');
  readonly query = input('');
  readonly subjectId = input<number | null>(null);
  readonly authorId = input<number | null>(null);
  readonly emptyIcon = input('ph ph-newspaper');
  readonly emptyTitle = input('Aucun article pour le moment');
  readonly emptyDescription = input('Reviens dans un instant ou change de filtre.');

  protected readonly store = inject(PostListStore);

  constructor() {
    effect(() => {
      const filters = {
        scope: this.scope(),
        q: this.query(),
        subjectId: this.subjectId(),
        authorId: this.authorId(),
      };
      untracked(() => void this.store.setFilters(filters));
    });
  }

  protected onChange(post: Post): void {
    if (this.scope() === 'saved' && !post.viewerHasBookmarked) {
      this.store.drop(post.id);
    } else {
      this.store.patch(post);
    }
  }
}
