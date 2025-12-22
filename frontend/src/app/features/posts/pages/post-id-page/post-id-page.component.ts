import { Component, inject, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { Post } from '@models/post';
import { map } from 'rxjs';
import { Tag } from 'primeng/tag';
import { DatePipe } from '@angular/common';
import { HeaderComponent } from '@components/header/header.component';
import { AddCommentFormComponent } from '../../components/add-comment-form/add-comment-form.component';
import { CommentStore } from '../../store/comment.store';

@Component({
  selector: 'app-post-id-page',
  imports: [Tag, DatePipe, HeaderComponent, AddCommentFormComponent],
  providers: [CommentStore],
  templateUrl: './post-id-page.component.html',
  host: {
    class: 'contents',
  },
})
export class PostIdPageComponent implements OnInit {
  readonly store = inject(CommentStore);
  private readonly route = inject(ActivatedRoute);

  post = toSignal<Post>(this.route.data.pipe(map((d) => d['post'])));
  postId = Number(this.route.snapshot.paramMap.get('postId'));

  comments = this.store.comments;

  ngOnInit(): void {
    this.store.fetchCommentsByPostId(this.postId);
  }
}
