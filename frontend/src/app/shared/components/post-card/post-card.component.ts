import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { Post } from '@models/post';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-post-card',
  imports: [DatePipe, TagModule],
  templateUrl: './post-card.component.html',
  host: {
    class: 'contents',
  },
})
export class PostCardComponent {
  post = input.required<Post>();
}
