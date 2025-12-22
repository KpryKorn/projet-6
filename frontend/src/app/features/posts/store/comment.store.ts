import { inject } from '@angular/core';
import { Comment } from '@models/comment';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { PostService } from '@services/post/post.service';
import { exhaustMap, pipe, tap } from 'rxjs';

type CommentState = {
  comments: Comment[];
  isLoading: boolean;
  error: string | null;
};

const initialState: CommentState = {
  comments: [],
  isLoading: false,
  error: null,
};

export const CommentStore = signalStore(
  withState(initialState),

  withMethods((store, postService = inject(PostService)) => ({
    fetchCommentsByPostId: rxMethod<number>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null })),

        exhaustMap((postId) => {
          return postService.getCommentsByPostId(postId).pipe(
            tap({
              next: (comments) => patchState(store, { comments, isLoading: false }),

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
