import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'app-tailwind-wrapper',
  imports: [],
  template: ``,
})
export class TailwindWrapperComponent {
  @HostBinding('class') classes = 'contents';
}
