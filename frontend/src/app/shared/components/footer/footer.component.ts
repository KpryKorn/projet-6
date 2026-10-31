import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <footer class="mt-24 border-t border-line">
      <div
        class="container-page flex flex-col gap-4 py-8 text-sm text-subtle md:flex-row md:items-center md:justify-between"
      >
        <p>© 2026 MDD, Monde de Dév.</p>
        <nav class="flex items-center gap-4" aria-label="Pied de page">
          <a routerLink="/legal" class="transition-colors duration-(--dur-1) ease-out hover:text-fg"
            >Mentions légales</a
          >
        </nav>
      </div>
    </footer>
  `,
})
export class FooterComponent {}
