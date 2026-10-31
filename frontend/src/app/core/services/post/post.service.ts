import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Comment, CommentRequest } from '@models/comment';
import { Engagement, Page, Post, PostQuery, PostRequest } from '@models/post';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PostService {
  private readonly http = inject(HttpClient);

  list(query: PostQuery): Observable<Page<Post>> {
    let params = new HttpParams()
      .set('scope', query.scope)
      .set('page', query.page ?? 0)
      .set('size', query.size ?? 10);
    if (query.q?.trim()) params = params.set('q', query.q.trim());
    if (query.subjectId) params = params.set('subjectId', query.subjectId);
    if (query.authorId) params = params.set('authorId', query.authorId);
    return this.http.get<Page<Post>>('/api/posts', { params });
  }

  trending(limit = 5): Observable<Post[]> {
    return this.http.get<Post[]>('/api/posts/trending', { params: { limit } });
  }

  get(id: number): Observable<Post> {
    return this.http.get<Post>(`/api/posts/${id}`);
  }

  create(request: PostRequest): Observable<Post> {
    return this.http.post<Post>('/api/posts', request);
  }

  update(id: number, request: PostRequest): Observable<Post> {
    return this.http.put<Post>(`/api/posts/${id}`, request);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`/api/posts/${id}`);
  }

  react(id: number): Observable<Engagement> {
    return this.http.put<Engagement>(`/api/posts/${id}/reaction`, {});
  }

  unreact(id: number): Observable<Engagement> {
    return this.http.delete<Engagement>(`/api/posts/${id}/reaction`);
  }

  bookmark(id: number): Observable<void> {
    return this.http.put<void>(`/api/posts/${id}/bookmark`, {});
  }

  unbookmark(id: number): Observable<void> {
    return this.http.delete<void>(`/api/posts/${id}/bookmark`);
  }

  comments(postId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`/api/posts/${postId}/comments`);
  }

  addComment(request: CommentRequest): Observable<Comment> {
    return this.http.post<Comment>('/api/comments', request);
  }

  removeComment(id: number): Observable<void> {
    return this.http.delete<void>(`/api/comments/${id}`);
  }
}
