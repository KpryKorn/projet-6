import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { Post } from '@models/post';
import { map } from 'rxjs';
import { Tag } from 'primeng/tag';
import { DatePipe } from '@angular/common';
import { HeaderComponent } from '@components/header/header.component';

@Component({
  selector: 'app-post-id-page',
  imports: [Tag, DatePipe, HeaderComponent],
  templateUrl: './post-id-page.component.html',
  host: {
    class: 'contents',
  },
})
export class PostIdPageComponent {
  post = toSignal<Post>(inject(ActivatedRoute).data.pipe(map((d) => d['post'])));
}
