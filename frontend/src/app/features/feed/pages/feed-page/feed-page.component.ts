import { Component } from '@angular/core';
import { HeaderComponent } from '@components/header/header.component';

@Component({
  selector: 'app-feed-page',
  imports: [HeaderComponent],
  templateUrl: './feed-page.component.html',
  host: {
    class: 'contents',
  },
})
export class FeedPageComponent {}
