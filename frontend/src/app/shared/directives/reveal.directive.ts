import { Directive, ElementRef, inject, input, OnDestroy, OnInit, output } from '@angular/core';

/** Fades an element in once, the first time it enters the viewport. */
@Directive({
  selector: '[appReveal]',
  host: { class: 'reveal', '[style.--reveal-delay]': 'delay() + "ms"' },
})
export class RevealDirective implements OnInit, OnDestroy {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private observer?: IntersectionObserver;
  readonly delay = input(0, { alias: 'revealDelay' });

  ngOnInit(): void {
    const node = this.el.nativeElement;
    if (typeof IntersectionObserver === 'undefined') {
      node.classList.add('is-visible');
      return;
    }
    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.classList.add('is-visible');
          this.observer?.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
    );
    this.observer.observe(node);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}

/** Emits when the element becomes visible, used as an infinite scroll sentinel. */
@Directive({ selector: '[appInView]' })
export class InViewDirective implements OnInit, OnDestroy {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private observer?: IntersectionObserver;
  readonly appInView = output<void>();

  ngOnInit(): void {
    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) this.appInView.emit();
      },
      { rootMargin: '400px 0px' },
    );
    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
