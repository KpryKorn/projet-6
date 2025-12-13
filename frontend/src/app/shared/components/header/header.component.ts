import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TailwindWrapperComponent } from '../tailwind-wrapper/tailwind-wrapper.component';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
})
export class HeaderComponent extends TailwindWrapperComponent {}
