import { Component, computed, inject, OnInit } from '@angular/core';
import { HeaderComponent } from '@components/header/header.component';
import { FeedStore } from '../../store/feed.store';
import { PostCardComponent } from '@components/post-card/post-card.component';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-feed-page',
  imports: [HeaderComponent, PostCardComponent, ButtonModule, RouterLink, NgClass],
  templateUrl: './feed-page.component.html',
  providers: [FeedStore],
  host: {
    class: 'contents',
  },
})
export class FeedPageComponent implements OnInit {
  readonly store = inject(FeedStore);

  posts = this.store.sortedPosts;

  onSortClick() {
    this.store.toggleSortOrder();
  }

  get isDefaultSortOrder() {
    return this.store.sortOrder() === 'default';
  }

  ngOnInit(): void {
    this.store.fetchFeedPosts({});
  }
}
