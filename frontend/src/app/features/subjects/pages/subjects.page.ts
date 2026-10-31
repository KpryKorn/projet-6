import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { EmptyStateComponent } from '@components/empty-state/empty-state.component';
import { SubjectCardComponent } from '@components/subject-card/subject-card.component';
import { RevealDirective } from '@directives/reveal.directive';
import { SubjectsStore } from '@store/subjects/subjects.store';
import { UserStore } from '@store/user/user.store';

@Component({
  selector: 'app-subjects-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SubjectCardComponent, EmptyStateComponent, RevealDirective],
  template: `
    <section class="page-in container-page py-8 md:py-12">
      <header class="flex flex-col gap-2">
        <p class="eyebrow">Explorer</p>
        <h1 class="text-3xl font-semibold text-fg">Les thèmes de la communauté</h1>
        <p class="max-w-xl text-base text-muted">
          Suis les langages et les outils qui comptent pour toi. Ton fil se construit à partir de
          ces choix.
        </p>
      </header>

      <div class="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div class="relative w-full md:max-w-xs">
          <i
            class="ph ph-magnifying-glass pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-subtle"
            aria-hidden="true"
          ></i>
          <input
            type="search"
            class="field pl-10"
            placeholder="Rechercher un thème"
            aria-label="Rechercher un thème"
            [value]="search()"
            (input)="search.set($any($event.target).value)"
          />
        </div>
        <div class="flex gap-1" role="group" aria-label="Filtrer les thèmes">
          @for (option of filters; track option.value) {
            <button
              type="button"
              class="btn btn-sm"
              [class]="filter() === option.value ? 'btn-secondary' : 'btn-ghost'"
              [attr.aria-pressed]="filter() === option.value"
              (click)="filter.set(option.value)"
            >
              {{ option.label }}
            </button>
          }
        </div>
      </div>

      <div class="mt-6">
        @switch (subjects.status()) {
          @case ('error') {
            <app-empty-state
              icon="ph ph-cloud-slash"
              title="Impossible de charger les thèmes"
              description="Le serveur ne répond pas pour l’instant. Réessaie dans un instant."
            >
              <button type="button" class="btn btn-primary" (click)="subjects.load(true)">
                Réessayer
              </button>
            </app-empty-state>
          }
          @case ('loaded') {
            @if (visible().length === 0) {
              <app-empty-state
                title="Aucun thème ne correspond"
                description="Essaie un autre mot ou affiche tous les thèmes."
              >
                <button type="button" class="btn btn-secondary" (click)="reset()">
                  Réinitialiser les filtres
                </button>
              </app-empty-state>
            } @else {
              <ul class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                @for (subject of visible(); track subject.id) {
                  <li appReveal><app-subject-card [subject]="subject" /></li>
                }
              </ul>
            }
          }
          @default {
            <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true">
              @for (n of [1, 2, 3, 4, 5, 6]; track n) {
                <div class="card h-48 animate-pulse bg-surface-2"></div>
              }
            </div>
          }
        }
      </div>
    </section>
  `,
})
export class SubjectsPage {
  protected readonly subjects = inject(SubjectsStore);
  private readonly user = inject(UserStore);

  protected readonly search = signal('');
  protected readonly filter = signal<'all' | 'followed'>('all');
  protected readonly filters = [
    { value: 'all' as const, label: 'Tous' },
    { value: 'followed' as const, label: 'Suivis' },
  ];

  protected readonly visible = computed(() => {
    const term = this.search().trim().toLowerCase();
    return this.subjects
      .subjects()
      .filter(
        (subject) =>
          (this.filter() === 'all' || this.user.subscribedIds().has(subject.id)) &&
          (!term ||
            subject.title.toLowerCase().includes(term) ||
            subject.description.toLowerCase().includes(term)),
      );
  });

  constructor() {
    void this.subjects.load(true);
  }

  protected reset(): void {
    this.search.set('');
    this.filter.set('all');
  }
}
