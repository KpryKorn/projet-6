import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-orbit',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block', 'aria-hidden': 'true' },
  template: `
    <svg viewBox="0 0 400 400" class="orbit" fill="none">
      <circle cx="200" cy="200" r="70" stroke="var(--line-strong)" />
      <circle cx="200" cy="200" r="130" stroke="var(--line)" />
      <circle cx="200" cy="200" r="190" stroke="var(--line)" stroke-dasharray="2 6" />
      <circle
        cx="200"
        cy="200"
        r="130"
        stroke="var(--accent)"
        stroke-width="1.5"
        stroke-dasharray="120 700"
        stroke-linecap="round"
      />
      <g class="orbit-spin">
        <circle cx="330" cy="200" r="5" fill="var(--accent)" />
        <circle cx="200" cy="10" r="4" fill="var(--fg)" />
        <circle cx="66" cy="266" r="4" fill="var(--surface)" stroke="var(--line-strong)" />
      </g>
      <circle cx="200" cy="200" r="6" fill="var(--fg)" />
    </svg>
  `,
})
export class OrbitComponent {}
