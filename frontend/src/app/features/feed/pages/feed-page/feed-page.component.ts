import { Component } from '@angular/core';
import { TailwindWrapperComponent } from '@components/tailwind-wrapper/tailwind-wrapper.component';
import { HeaderComponent } from '@components/header/header.component';

@Component({
  selector: 'app-feed-page',
  imports: [HeaderComponent],
  templateUrl: './feed-page.component.html',
})
export class FeedPageComponent extends TailwindWrapperComponent {}
