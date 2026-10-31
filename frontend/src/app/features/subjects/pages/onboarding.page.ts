import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { EmptyStateComponent } from '@components/empty-state/empty-state.component';
import { SubjectCardComponent } from '@components/subject-card/subject-card.component';
import { RevealDirective } from '@directives/reveal.directive';
import { SubjectsStore } from '@store/subjects/subjects.store';
import { UserStore } from '@store/user/user.store';

@Component({
  selector: 'app-onboarding-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SubjectCardComponent, EmptyStateComponent, RevealDirective],
  template: `
    <section class="page-in container-page py-8 md:py-12">
      <header class="flex flex-col gap-2">
        <p class="eyebrow">Bienvenue sur MDD</p>
        <h1 class="text-3xl font-semibold text-fg">Quels thèmes t’intéressent ?</h1>
        <p class="max-w-xl text-base text-muted">
          Choisis-en trois ou plus. Ton fil affichera les articles qui s’y rapportent, et tu pourras
          changer cette sélection à tout moment.
        </p>
      </header>

      <div class="mt-8">
        @if (subjects.status() === 'error') {
          <app-empty-state
            icon="ph ph-cloud-slash"
            title="Impossible de charger les thèmes"
            description="Le serveur ne répond pas pour l’instant. Réessaie dans un instant."
          >
            <button type="button" class="btn btn-primary" (click)="subjects.load(true)">
              Réessayer
            </button>
          </app-empty-state>
        } @else if (subjects.status() === 'loaded') {
          <ul class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            @for (subject of subjects.subjects(); track subject.id) {
              <li appReveal><app-subject-card [subject]="subject" /></li>
            }
          </ul>
        } @else {
          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true">
            @for (n of [1, 2, 3, 4, 5, 6]; track n) {
              <div class="card h-48 animate-pulse bg-surface-2"></div>
            }
          </div>
        }
      </div>

      <div
        class="sticky bottom-4 z-30 mt-8 flex items-center justify-between gap-4 rounded-lg border border-line-strong bg-surface px-4 py-3 shadow-lg"
      >
        <p class="text-base text-muted" aria-live="polite">
          <span class="font-semibold text-fg">{{ count() }}</span>
          {{ count() > 1 ? 'thèmes suivis' : 'thème suivi' }}
          @if (remaining() > 0) {
            <span class="hidden sm:inline">
              · encore {{ remaining() }} à choisir pour un fil plus fourni</span
            >
          }
        </p>
        <button type="button" class="btn btn-primary" (click)="done()">
          {{ count() === 0 ? 'Passer cette étape' : 'Voir mon fil' }}
          <i class="ph-bold ph-arrow-right" aria-hidden="true"></i>
        </button>
      </div>
    </section>
  `,
})
export class OnboardingPage {
  protected readonly subjects = inject(SubjectsStore);
  private readonly user = inject(UserStore);
  private readonly router = inject(Router);

  protected readonly count = computed(() => this.user.subscriptions().length);
  protected readonly remaining = computed(() => Math.max(0, 3 - this.count()));

  constructor() {
    void this.subjects.load(true);
  }

  protected done(): void {
    void this.router.navigateByUrl('/feed');
  }
}
