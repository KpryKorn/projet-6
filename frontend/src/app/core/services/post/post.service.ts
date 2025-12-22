import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Comment, CommentRequest } from '@models/comment';
import { Post, PostRequest } from '@models/post';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private readonly http = inject(HttpClient);

  createPost(postRequest: PostRequest): Observable<void> {
    return this.http.post<void>(`/api/posts`, { ...postRequest });
  }

  getPostById(postId: number): Observable<Post> {
    return this.http.get<Post>(`/api/posts/${postId}`);
  }

  getFeedPosts(params: { page: number; size: number }): Observable<Post[]> {
    return this.http.get<Post[]>(`/api/posts/feed`, { params });
  }

  getCommentsByPostId(postId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`/api/posts/${postId}/comments`);
  }

  createComment(commentRequest: CommentRequest): Observable<void> {
    return this.http.post<void>(`/api/comments`, { ...commentRequest });
  }
}
