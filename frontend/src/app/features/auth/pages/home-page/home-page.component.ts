import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home-page',
  imports: [NgOptimizedImage, ButtonModule, RouterLink],
  templateUrl: './home-page.component.html',
  host: {
    class: 'contents',
  },
})
export class HomePageComponent {}
