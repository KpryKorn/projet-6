import { DOCUMENT } from '@angular/common';
import { inject, Injectable, signal } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  readonly theme = signal<Theme>(
    this.document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark',
  );

  toggle(): void {
    this.set(this.theme() === 'dark' ? 'light' : 'dark');
  }

  set(theme: Theme): void {
    this.theme.set(theme);
    this.document.documentElement.setAttribute('data-theme', theme);
    this.document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', theme === 'dark' ? '#0b0c0e' : '#f7f7f8');
    try {
      localStorage.setItem('mdd-theme', theme);
    } catch {
      // Storage can be unavailable in private mode, the theme still applies for this visit.
    }
  }
}
