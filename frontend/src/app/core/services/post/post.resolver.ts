import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { PostService } from './post.service';
import { catchError, EMPTY } from 'rxjs';
import { Post } from '@models/post';

export const postResolver: ResolveFn<Post> = (route, state) => {
  const postService = inject(PostService);
  const router = inject(Router);

  const postId = Number(route.paramMap.get('postId'));

  if (!postId) {
    router.navigate(['/404']);
    return EMPTY;
  }

  return postService.getPostById(postId).pipe(
    catchError((err) => {
      router.navigate(['/404']);
      return EMPTY;
    })
  );
};
