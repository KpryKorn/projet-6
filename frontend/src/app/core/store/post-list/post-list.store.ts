import { inject } from '@angular/core';
import { FeedScope, Post } from '@models/post';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { PostService } from '@services/post/post.service';
import { firstValueFrom } from 'rxjs';

export interface PostFilters {
  scope: FeedScope;
  q: string;
  subjectId: number | null;
  authorId: number | null;
}

interface PostListState {
  items: Post[];
  page: number;
  hasNext: boolean;
  total: number;
  status: 'loading' | 'loaded' | 'error';
  loadingMore: boolean;
  filters: PostFilters;
}

const PAGE_SIZE = 8;

/** Provided per page, so the feed, a topic page and a profile each keep their own list. */
export const PostListStore = signalStore(
  withState<PostListState>({
    items: [],
    page: 0,
    hasNext: false,
    total: 0,
    status: 'loading',
    loadingMore: false,
    filters: { scope: 'all', q: '', subjectId: null, authorId: null },
  }),
  withMethods((store, postService = inject(PostService)) => {
    let ticket = 0;

    const fetchPage = async (page: number) =>
      firstValueFrom(postService.list({ ...store.filters(), page, size: PAGE_SIZE }));

    const reload = async () => {
      const current = ++ticket;
      patchState(store, { status: 'loading', items: [], page: 0, hasNext: false });
      try {
        const result = await fetchPage(0);
        if (current !== ticket) return;
        patchState(store, {
          items: result.content,
          page: 0,
          hasNext: result.hasNext,
          total: result.totalElements,
          status: 'loaded',
        });
      } catch {
        if (current === ticket) patchState(store, { status: 'error' });
      }
    };

    return {
      reload,

      async setFilters(changes: Partial<PostFilters>): Promise<void> {
        patchState(store, { filters: { ...store.filters(), ...changes } });
        await reload();
      },

      async loadMore(): Promise<void> {
        if (!store.hasNext() || store.loadingMore() || store.status() !== 'loaded') return;
        const current = ticket;
        patchState(store, { loadingMore: true });
        try {
          const result = await fetchPage(store.page() + 1);
          if (current !== ticket) return;
          patchState(store, {
            items: [...store.items(), ...result.content],
            page: result.page,
            hasNext: result.hasNext,
            loadingMore: false,
          });
        } catch {
          patchState(store, { loadingMore: false });
        }
      },

      patch(post: Post): void {
        patchState(store, {
          items: store.items().map((item) => (item.id === post.id ? { ...item, ...post } : item)),
        });
      },

      /** A bookmark removed from the "saved" tab leaves the list right away. */
      drop(postId: number): void {
        patchState(store, {
          items: store.items().filter((item) => item.id !== postId),
          total: Math.max(0, store.total() - 1),
        });
      },
    };
  }),
);
