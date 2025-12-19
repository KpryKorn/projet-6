import { Component, inject, OnInit } from '@angular/core';
import { HeaderComponent } from '@components/header/header.component';
import { FeedStore } from '../../store/feed.store';
import { PostCardComponent } from '@components/post-card/post-card.component';

@Component({
  selector: 'app-feed-page',
  imports: [HeaderComponent, PostCardComponent],
  templateUrl: './feed-page.component.html',
  providers: [FeedStore],
  host: {
    class: 'contents',
  },
})
export class FeedPageComponent implements OnInit {
  readonly store = inject(FeedStore);

  ngOnInit(): void {
    this.store.fetchFeedPosts({});
  }
}
