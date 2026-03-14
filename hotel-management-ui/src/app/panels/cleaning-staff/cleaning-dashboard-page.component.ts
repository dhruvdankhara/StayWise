import { ChangeDetectionStrategy, Component } from '@angular/core';

import { demoTasks, roleHeadlines, roleMetrics } from '../../core/data/demo-data';
import { MetricCardComponent } from '../../shared/components/metric-card.component';

@Component({
  selector: 'app-cleaning-dashboard-page',
  imports: [MetricCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Cleaning staff panel</p>
          <h1>Personal task queue and room readiness updates.</h1>
          <p>{{ headline }}</p>
        </div>
      </div>
      <div class="card-grid card-grid--three">
        @for (metric of metrics; track metric.label) {
          <app-metric-card [label]="metric.label" [value]="metric.value" [change]="metric.change" />
        }
      </div>
      <div class="card-grid">
        @for (task of tasks; track task.id) {
          <article class="surface review-card">
            <p class="pill">{{ task.status }}</p>
            <h3>Room {{ task.roomNumber }} · {{ task.priority }}</h3>
            <p>{{ task.note }}</p>
            <strong>{{ task.assignee }}</strong>
          </article>
        }
      </div>
    </section>
  `
})
export class CleaningDashboardPageComponent {
  protected readonly headline = roleHeadlines.cleaning_staff;
  protected readonly metrics = roleMetrics.cleaning_staff;
  protected readonly tasks = demoTasks;
}
