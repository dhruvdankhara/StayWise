import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { roleHeadlines, roleMetrics } from '../../core/data/demo-data';
import { AuthService } from '../../core/services/auth.service';
import { MetricCardComponent } from '../../shared/components/metric-card.component';

@Component({
  selector: 'app-guest-overview-page',
  imports: [MetricCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Guest dashboard</p>
          <h1>Welcome back, {{ userName() }}.</h1>
          <p>{{ headline() }}</p>
        </div>
      </div>
      <div class="card-grid card-grid--three">
        @for (metric of metrics(); track metric.label) {
          <app-metric-card [label]="metric.label" [value]="metric.value" [change]="metric.change" />
        }
      </div>
      <div class="surface section-panel">
        <p class="eyebrow">Concierge notes</p>
        <h2>Preferences, invoices, and stay management in one place.</h2>
        <p>Guest panel includes booking downloads, payment history, profile editing, and post-checkout reviews.</p>
      </div>
    </section>
  `
})
export class GuestOverviewPageComponent {
  private readonly authService = inject(AuthService);
  readonly userName = computed(() => this.authService.user()?.name ?? 'Guest');
  readonly headline = computed(() => roleHeadlines.guest);
  readonly metrics = computed(() => roleMetrics.guest);
}
