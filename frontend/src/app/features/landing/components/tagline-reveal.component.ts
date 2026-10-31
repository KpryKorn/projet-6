import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  OnDestroy,
} from '@angular/core';

/** Each word moves from a muted tone to full contrast as it crosses a trigger line. */
@Component({
  selector: 'app-tagline-reveal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p
      class="max-w-4xl text-3xl leading-[38px] font-semibold tracking-[-0.025em] md:text-5xl md:leading-[56px]"
    >
      @for (word of words(); track $index) {
        <span class="tagline-word">{{ word }}</span
        >{{ ' ' }}
      }
    </p>
  `,
  styles: `
    .tagline-word {
      color: color-mix(in srgb, var(--fg) 28%, transparent);
      transition: color 400ms var(--ease-out);
    }
    .tagline-word.is-active {
      color: var(--fg);
    }
  `,
})
export class TaglineRevealComponent implements AfterViewInit, OnDestroy {
  readonly text = input.required<string>();
  protected readonly words = computed(() => this.text().split(/\s+/).filter(Boolean));

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private observer?: IntersectionObserver;

  ngAfterViewInit(): void {
    const nodes = Array.from(
      this.host.nativeElement.querySelectorAll<HTMLElement>('.tagline-word'),
    );
    if (
      typeof IntersectionObserver === 'undefined' ||
      matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      nodes.forEach((node) => node.classList.add('is-active'));
      return;
    }
    // The bottom margin places the trigger line at 60% of the viewport height.
    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-active');
            this.observer?.unobserve(entry.target);
          }
        }
      },
      { rootMargin: '0px 0px -40% 0px' },
    );
    nodes.forEach((node) => this.observer!.observe(node));
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
