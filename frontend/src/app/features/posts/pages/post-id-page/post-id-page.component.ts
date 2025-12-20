import { Component, inject, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { Post } from '@models/post';
import { map } from 'rxjs';
import { Tag } from 'primeng/tag';
import { DatePipe } from '@angular/common';
import { HeaderComponent } from '@components/header/header.component';
import { AddCommentFormComponent } from '../../components/add-comment-form/add-comment-form.component';
import { PostService } from '@services/post/post.service';
import { Comment } from '@models/comment';

@Component({
  selector: 'app-post-id-page',
  imports: [Tag, DatePipe, HeaderComponent, AddCommentFormComponent],
  templateUrl: './post-id-page.component.html',
  host: {
    class: 'contents',
  },
})
export class PostIdPageComponent implements OnInit {
  private readonly postService = inject(PostService);
  private readonly route = inject(ActivatedRoute);

  // TODO: bouger la logique de fetch des commentaires dans le store ?
  // TODO: template html
  commentsSig = signal<Comment[]>([]);

  readonly comments = this.commentsSig.asReadonly();

  post = toSignal<Post>(this.route.data.pipe(map((d) => d['post'])));
  postId = Number(this.route.snapshot.paramMap.get('postId'));

  loadComments() {
    return this.postService.getCommentsByPostId(this.postId);
  }

  ngOnInit(): void {
    this.loadComments().subscribe((comments) => {
      this.commentsSig.set(comments);
    });
  }
}
