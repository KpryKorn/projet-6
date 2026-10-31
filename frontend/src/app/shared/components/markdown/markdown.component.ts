import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MarkdownService } from '@services/markdown/markdown.service';

@Component({
  selector: 'app-markdown',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="md" [innerHTML]="html()"></div>`,
})
export class MarkdownContentComponent {
  readonly source = input.required<string>();

  private readonly markdown = inject(MarkdownService);
  private readonly sanitizer = inject(DomSanitizer);

  // The service already sanitizes with DOMPurify; Angular's own sanitizer would strip the highlight classes.
  protected readonly html = computed(() =>
    this.sanitizer.bypassSecurityTrustHtml(this.markdown.render(this.source())),
  );
}
