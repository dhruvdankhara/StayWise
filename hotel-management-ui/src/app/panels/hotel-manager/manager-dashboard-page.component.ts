import { ChangeDetectionStrategy, Component } from '@angular/core';

import { demoBookings, demoTasks, roleHeadlines, roleMetrics } from '../../core/data/demo-data';
import { MetricCardComponent } from '../../shared/components/metric-card.component';

@Component({
  selector: 'app-manager-dashboard-page',
  imports: [MetricCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Hotel manager panel</p>
          <h1>Operations pulse for arrivals, housekeeping, and revenue.</h1>
          <p>{{ headline }}</p>
        </div>
      </div>
      <div class="card-grid card-grid--three">
        @for (metric of metrics; track metric.label) {
          <app-metric-card [label]="metric.label" [value]="metric.value" [change]="metric.change" />
        }
      </div>
      <div class="section-grid">
        <article class="surface section-panel">
          <p class="eyebrow">Booking management</p>
          <div class="stack-list">
            @for (booking of bookings; track booking.id) {
              <div>
                <strong>{{ booking.guestName }} · {{ booking.ref }}</strong>
                <span>{{ booking.roomType }} · {{ booking.status }} · {{ booking.checkIn }} to {{ booking.checkOut }}</span>
              </div>
            }
          </div>
        </article>
        <article class="surface section-panel">
          <p class="eyebrow">Housekeeping oversight</p>
          <div class="stack-list">
            @for (task of tasks; track task.id) {
              <div>
                <strong>Room {{ task.roomNumber }} · {{ task.priority }}</strong>
                <span>{{ task.status }} · {{ task.assignee }} · {{ task.note }}</span>
              </div>
            }
          </div>
        </article>
      </div>
    </section>
  `
})
export class ManagerDashboardPageComponent {
  protected readonly headline = roleHeadlines.hotel_manager;
  protected readonly metrics = roleMetrics.hotel_manager;
  protected readonly bookings = demoBookings;
  protected readonly tasks = demoTasks;
}
