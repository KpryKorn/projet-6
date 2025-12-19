import { inject } from '@angular/core';
import { Post } from '@models/post';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { PostService } from '@services/post/post.service';
import { exhaustMap, pipe, tap } from 'rxjs';

type FeedState = {
  posts: Post[];
  isLoading: boolean;
  error: string | null;
};

const initialState: FeedState = {
  posts: [],
  isLoading: false,
  error: null,
};

export const FeedStore = signalStore(
  withState(initialState),

  withMethods((store, postService = inject(PostService)) => ({
    fetchFeedPosts: rxMethod<Partial<{ page: number; size: number }>>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null })),

        exhaustMap((params) => {
          const { page = 0, size = 20 } = params || {};
          return postService.getFeedPosts({ page, size }).pipe(
            tap({
              next: (posts) => patchState(store, { posts, isLoading: false }),

              error: (error) =>
                patchState(store, {
                  isLoading: false,
                  error: error.message,
                }),
            })
          );
        })
      )
    ),
  }))
);
