import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <section class="page-in container-page flex flex-col items-center gap-6 py-24 text-center">
      <p class="font-mono text-6xl font-semibold text-accent-text">404</p>
      <h1 class="text-3xl font-semibold text-fg">Cette page est introuvable</h1>
      <p class="max-w-md text-lg text-muted">
        Le lien est peut-être incorrect, ou la page a été déplacée. Reviens à l’accueil pour
        reprendre ta lecture.
      </p>
      <a routerLink="/" class="btn btn-primary px-4 py-3">
        <i class="ph-bold ph-house" aria-hidden="true"></i>
        Retour à l’accueil
      </a>
    </section>
  `,
})
export class NotFoundPage {}
