import { Component } from '@angular/core';
import { TailwindWrapperComponent } from '../../components/tailwind-wrapper/tailwind-wrapper.component';
import { NgOptimizedImage } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home-page',
  imports: [NgOptimizedImage, ButtonModule, RouterLink],
  templateUrl: './home-page.component.html',
})
export class HomePageComponent extends TailwindWrapperComponent {}
