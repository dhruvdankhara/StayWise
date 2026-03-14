import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-metric-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="metric-card surface">
      <p class="eyebrow">{{ label() }}</p>
      <h3>{{ value() }}</h3>
      <p class="metric-card__change">{{ change() }}</p>
    </article>
  `
})
export class MetricCardComponent {
  readonly label = input.required<string>();
  readonly value = input.required<string>();
  readonly change = input.required<string>();
}
