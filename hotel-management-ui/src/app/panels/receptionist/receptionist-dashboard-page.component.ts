import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { demoBookings, roleHeadlines, roleMetrics } from '../../core/data/demo-data';
import { MetricCardComponent } from '../../shared/components/metric-card.component';

@Component({
  selector: 'app-receptionist-dashboard-page',
  imports: [MetricCardComponent, CurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Receptionist panel</p>
          <h1>Front desk command centre.</h1>
          <p>{{ headline }}</p>
        </div>
      </div>
      <div class="card-grid card-grid--three">
        @for (metric of metrics; track metric.label) {
          <app-metric-card [label]="metric.label" [value]="metric.value" [change]="metric.change" />
        }
      </div>
      <div class="table-shell surface">
        <table>
          <thead><tr><th>Guest</th><th>Reference</th><th>Stay</th><th>Status</th><th>Balance</th></tr></thead>
          <tbody>
            @for (booking of bookings; track booking.id) {
              <tr>
                <td>{{ booking.guestName }}</td>
                <td>{{ booking.ref }}</td>
                <td>{{ booking.checkIn }} to {{ booking.checkOut }}</td>
                <td><span class="pill">{{ booking.status }}</span></td>
                <td>{{ booking.amount | currency: 'INR' : 'symbol' : '1.0-0' }}</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </section>
  `
})
export class ReceptionistDashboardPageComponent {
  protected readonly headline = roleHeadlines.receptionist;
  protected readonly metrics = roleMetrics.receptionist;
  protected readonly bookings = demoBookings;
}
