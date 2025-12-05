import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'app-tailwind-wrapper',
  imports: [],
  templateUrl: './tailwind-wrapper.component.html',
})
export class TailwindWrapperComponent {
  @HostBinding('class') classes = 'contents';
}
