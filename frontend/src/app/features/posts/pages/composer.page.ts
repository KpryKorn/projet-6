import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  OnDestroy,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { EmptyStateComponent } from '@components/empty-state/empty-state.component';
import { MarkdownContentComponent } from '@components/markdown/markdown.component';
import { PostService } from '@services/post/post.service';
import { ToastService } from '@services/toast/toast.service';
import { SubjectsStore } from '@store/subjects/subjects.store';
import { UserStore } from '@store/user/user.store';
import { errorMessage } from '@utils/errors';
import { firstValueFrom } from 'rxjs';

const DRAFT_KEY = 'mdd-draft';
const MAX_TITLE = 150;
const MAX_CONTENT = 20000;

@Component({
  selector: 'app-composer-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, MarkdownContentComponent, EmptyStateComponent],
  template: `
    <section class="page-in container-page max-w-3xl py-8 md:py-12">
      @if (forbidden()) {
        <app-empty-state
          icon="ph ph-lock"
          title="Tu ne peux pas modifier cet article"
          description="Seul son auteur peut le modifier. Tu peux en revanche le lire et le commenter."
        >
          <a [routerLink]="['/posts', id()]" class="btn btn-primary">Lire l’article</a>
        </app-empty-state>
      } @else {
        <header class="flex flex-col gap-2">
          <p class="eyebrow">{{ id() ? 'Modification' : 'Nouvel article' }}</p>
          <h1 class="text-3xl font-semibold text-fg">
            {{ id() ? 'Modifier ton article' : 'Partage ce que tu as appris' }}
          </h1>
        </header>

        @if (error(); as message) {
          <p
            role="alert"
            class="mt-6 flex items-start gap-2 rounded-md border border-danger/20 bg-danger-soft px-3 py-2 text-sm text-danger"
          >
            <i class="ph-fill ph-warning-circle mt-0.5 text-base" aria-hidden="true"></i>
            {{ message }}
          </p>
        }

        <form
          class="mt-8 flex flex-col gap-6"
          (submit)="$event.preventDefault(); publish()"
          novalidate
        >
          <div class="flex flex-col gap-1">
            <label for="subject" class="text-sm font-medium text-fg">Thème</label>
            <select
              id="subject"
              class="field"
              [value]="subjectId() ?? ''"
              (change)="subjectId.set(+$any($event.target).value || null); saveDraft()"
              [attr.aria-invalid]="submitted() && !subjectId()"
            >
              <option value="" disabled>Choisis un thème</option>
              @for (subject of subjects.subjects(); track subject.id) {
                <option [value]="subject.id" [selected]="subject.id === subjectId()">
                  {{ subject.title }}
                </option>
              }
            </select>
            @if (submitted() && !subjectId()) {
              <p class="text-sm text-danger">Choisis un thème pour ton article.</p>
            }
          </div>

          <div class="flex flex-col gap-1">
            <label for="title" class="text-sm font-medium text-fg">Titre</label>
            <input
              id="title"
              class="field text-xl font-semibold"
              placeholder="Un titre qui donne envie de lire la suite"
              [value]="title()"
              [attr.maxlength]="maxTitle"
              (input)="title.set($any($event.target).value); saveDraft()"
              [attr.aria-invalid]="submitted() && !title().trim()"
            />
            <div class="flex justify-between text-sm">
              @if (submitted() && !title().trim()) {
                <p class="text-danger">Le titre est obligatoire.</p>
              } @else {
                <span></span>
              }
              <span class="text-subtle tabular-nums">{{ title().length }} / {{ maxTitle }}</span>
            </div>
          </div>

          <div class="flex flex-col gap-2">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <div
                class="flex gap-1 rounded-md bg-surface-2 p-1"
                role="tablist"
                aria-label="Mode d’édition"
              >
                <button
                  type="button"
                  role="tab"
                  class="btn btn-sm"
                  [class]="!preview() ? 'bg-surface text-fg shadow-sm' : 'btn-ghost'"
                  [attr.aria-selected]="!preview()"
                  (click)="preview.set(false)"
                >
                  Écrire
                </button>
                <button
                  type="button"
                  role="tab"
                  class="btn btn-sm"
                  [class]="preview() ? 'bg-surface text-fg shadow-sm' : 'btn-ghost'"
                  [attr.aria-selected]="preview()"
                  (click)="preview.set(true)"
                >
                  Aperçu
                </button>
              </div>

              @if (!preview()) {
                <div class="flex items-center gap-1" role="toolbar" aria-label="Mise en forme">
                  @for (tool of tools; track tool.label) {
                    <button
                      type="button"
                      class="btn btn-ghost btn-sm size-10 px-0"
                      [attr.aria-label]="tool.label"
                      [title]="tool.label"
                      (click)="tool.run()"
                    >
                      <i [class]="tool.icon + ' text-lg'" aria-hidden="true"></i>
                    </button>
                  }
                </div>
              }
            </div>

            @if (preview()) {
              <div class="card min-h-96 p-4 md:p-6">
                @if (content().trim()) {
                  <app-markdown [source]="content()" />
                } @else {
                  <p class="text-base text-muted">Rien à prévisualiser pour l’instant.</p>
                }
              </div>
            } @else {
              <label for="content" class="sr-only">Contenu de l’article en Markdown</label>
              <textarea
                #editor
                id="content"
                class="field min-h-96 resize-y font-mono text-sm"
                placeholder="Écris en Markdown : ## pour un titre, trois accents graves pour du code, un tiret pour une liste."
                [value]="content()"
                [attr.maxlength]="maxContent"
                (input)="content.set($any($event.target).value); saveDraft()"
                [attr.aria-invalid]="submitted() && !content().trim()"
              ></textarea>
            }

            <div class="flex justify-between text-sm">
              @if (submitted() && !content().trim()) {
                <p class="text-danger">Le contenu est obligatoire.</p>
              } @else {
                <span class="text-subtle">
                  {{ wordCount() }} mots · environ {{ readingMinutes() }} min de lecture
                </span>
              }
              <span class="text-subtle tabular-nums"
                >{{ content().length }} / {{ maxContent }}</span
              >
            </div>
          </div>

          <div class="flex items-center justify-between gap-4">
            <p class="text-sm text-subtle" aria-live="polite">
              {{ !id() && draftSaved() ? 'Brouillon enregistré sur cet appareil' : '' }}
            </p>
            <div class="flex items-center gap-2">
              <a [routerLink]="id() ? ['/posts', id()] : '/feed'" class="btn btn-ghost">Annuler</a>
              <button type="submit" class="btn btn-primary" [disabled]="busy()">
                @if (busy()) {
                  <i class="ph ph-circle-notch animate-spin" aria-hidden="true"></i>
                }
                {{ id() ? 'Enregistrer les modifications' : 'Publier' }}
              </button>
            </div>
          </div>
        </form>
      }
    </section>
  `,
})
export class ComposerPage implements OnDestroy {
  readonly id = input<string>();
  readonly subject = input<string>();

  protected readonly maxTitle = MAX_TITLE;
  protected readonly maxContent = MAX_CONTENT;
  protected readonly subjects = inject(SubjectsStore);
  private readonly user = inject(UserStore);
  private readonly service = inject(PostService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);
  private readonly editor = viewChild<ElementRef<HTMLTextAreaElement>>('editor');

  protected readonly subjectId = signal<number | null>(null);
  protected readonly title = signal('');
  protected readonly content = signal('');
  protected readonly preview = signal(false);
  protected readonly busy = signal(false);
  protected readonly submitted = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly forbidden = signal(false);
  protected readonly draftSaved = signal(false);

  protected readonly wordCount = computed(
    () => this.content().trim().split(/\s+/).filter(Boolean).length,
  );
  protected readonly readingMinutes = computed(() =>
    Math.max(1, Math.round(this.wordCount() / 200)),
  );

  protected readonly tools = [
    { label: 'Titre', icon: 'ph ph-text-h-two', run: () => this.linePrefix('## ') },
    { label: 'Gras', icon: 'ph ph-text-b', run: () => this.wrap('**') },
    { label: 'Italique', icon: 'ph ph-text-italic', run: () => this.wrap('*') },
    { label: 'Code en ligne', icon: 'ph ph-code', run: () => this.wrap('`') },
    {
      label: 'Bloc de code',
      icon: 'ph ph-brackets-curly',
      run: () => this.wrap('\n```ts\n', '\n```\n', 'code'),
    },
    { label: 'Liste', icon: 'ph ph-list-bullets', run: () => this.linePrefix('- ') },
    { label: 'Citation', icon: 'ph ph-quotes', run: () => this.linePrefix('> ') },
    {
      label: 'Lien',
      icon: 'ph ph-link',
      run: () => this.wrap('[', '](https://)', 'texte du lien'),
    },
  ];

  private draftTimer?: ReturnType<typeof setTimeout>;
  private draftFlash?: ReturnType<typeof setTimeout>;

  constructor() {
    void this.subjects.load();
    effect(() => {
      const id = this.id();
      const preselected = this.subject();
      untracked(() => (id ? void this.loadPost(Number(id)) : this.initNew(preselected)));
    });
  }

  ngOnDestroy(): void {
    clearTimeout(this.draftTimer);
    clearTimeout(this.draftFlash);
  }

  private initNew(preselected?: string): void {
    this.forbidden.set(false);
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const draft = JSON.parse(raw) as {
          subjectId: number | null;
          title: string;
          content: string;
        };
        this.subjectId.set(draft.subjectId);
        this.title.set(draft.title);
        this.content.set(draft.content);
        if (draft.title || draft.content) this.toast.info('Ton brouillon a été restauré.');
      }
    } catch {
      localStorage.removeItem(DRAFT_KEY);
    }
    if (preselected && !this.subjectId()) this.subjectId.set(Number(preselected));
  }

  private async loadPost(id: number): Promise<void> {
    try {
      const post = await firstValueFrom(this.service.get(id));
      await this.waitForUser();
      if (this.user.me() && post.author.id !== this.user.me()?.id) {
        this.forbidden.set(true);
        return;
      }
      this.subjectId.set(post.subject.id);
      this.title.set(post.title);
      this.content.set(post.content ?? '');
    } catch {
      await this.router.navigateByUrl('/feed');
      this.toast.error('Cet article est introuvable.');
    }
  }

  private async waitForUser(): Promise<void> {
    for (let attempt = 0; attempt < 20 && !this.user.me(); attempt++) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  protected saveDraft(): void {
    if (this.id()) return;
    clearTimeout(this.draftTimer);
    this.draftTimer = setTimeout(() => {
      try {
        localStorage.setItem(
          DRAFT_KEY,
          JSON.stringify({
            subjectId: this.subjectId(),
            title: this.title(),
            content: this.content(),
          }),
        );
        this.draftSaved.set(true);
        clearTimeout(this.draftFlash);
        this.draftFlash = setTimeout(() => this.draftSaved.set(false), 2500);
      } catch {
        // Storage can be full or blocked, the draft is simply not kept.
      }
    }, 600);
  }

  private wrap(before: string, after = before, placeholder = 'texte'): void {
    const el = this.editor()?.nativeElement;
    if (!el) return;
    const { selectionStart: start, selectionEnd: end, value } = el;
    const selected = value.slice(start, end) || placeholder;
    this.apply(
      el,
      value.slice(0, start) + before + selected + after + value.slice(end),
      start + before.length,
      start + before.length + selected.length,
    );
  }

  private linePrefix(prefix: string): void {
    const el = this.editor()?.nativeElement;
    if (!el) return;
    const { selectionStart: start, selectionEnd: end, value } = el;
    const lineStart = value.lastIndexOf('\n', start - 1) + 1;
    const block = value.slice(lineStart, end);
    const prefixed = block
      .split('\n')
      .map((line) => prefix + line)
      .join('\n');
    this.apply(
      el,
      value.slice(0, lineStart) + prefixed + value.slice(end),
      start + prefix.length,
      end + (prefixed.length - block.length),
    );
  }

  private apply(
    el: HTMLTextAreaElement,
    next: string,
    selectStart: number,
    selectEnd: number,
  ): void {
    el.value = next;
    this.content.set(next);
    el.focus();
    el.setSelectionRange(selectStart, selectEnd);
    this.saveDraft();
  }

  protected async publish(): Promise<void> {
    this.submitted.set(true);
    this.error.set(null);
    const subjectId = this.subjectId();
    if (!subjectId || !this.title().trim() || !this.content().trim()) return;
    this.busy.set(true);
    const request = { subjectId, title: this.title().trim(), content: this.content().trim() };
    try {
      const id = this.id();
      const post = id
        ? await firstValueFrom(this.service.update(Number(id), request))
        : await firstValueFrom(this.service.create(request));
      clearTimeout(this.draftTimer);
      if (!id) localStorage.removeItem(DRAFT_KEY);
      this.toast.success(id ? 'Modifications enregistrées.' : 'Ton article est publié.');
      await this.router.navigate(['/posts', post.id]);
    } catch (err) {
      this.error.set(
        errorMessage(
          err,
          'La publication a échoué. Ton texte est conservé, réessaie dans un instant.',
        ),
      );
    } finally {
      this.busy.set(false);
    }
  }
}
