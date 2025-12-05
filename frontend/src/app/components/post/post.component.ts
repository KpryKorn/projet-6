import { Component, HostBinding } from '@angular/core';
import { TailwindWrapperComponent } from '../shared/tailwind-wrapper/tailwind-wrapper.component';

@Component({
  selector: 'app-post',
  imports: [],
  templateUrl: './post.component.html',
})
export class PostComponent extends TailwindWrapperComponent {}
