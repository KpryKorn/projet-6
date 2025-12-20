import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
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
}
