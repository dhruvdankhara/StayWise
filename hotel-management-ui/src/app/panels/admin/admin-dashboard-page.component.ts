import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { demoBookings, demoRooms, demoUsers, roleHeadlines, roleMetrics } from '../../core/data/demo-data';
import { MetricCardComponent } from '../../shared/components/metric-card.component';

@Component({
  selector: 'app-admin-dashboard-page',
  imports: [MetricCardComponent, CurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Admin dashboard</p>
          <h1>Executive oversight for the entire property.</h1>
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
          <p class="eyebrow">Recent bookings</p>
          <div class="table-shell">
            <table>
              <thead><tr><th>Guest</th><th>Room</th><th>Status</th><th>Total</th></tr></thead>
              <tbody>
                @for (booking of bookings; track booking.id) {
                  <tr>
                    <td>{{ booking.guestName }}</td>
                    <td>{{ booking.roomType }}</td>
                    <td><span class="pill">{{ booking.status }}</span></td>
                    <td>{{ booking.amount | currency: 'INR' : 'symbol' : '1.0-0' }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </article>
        <article class="surface section-panel">
          <p class="eyebrow">Room status mix</p>
          <div class="stack-list">
            @for (room of rooms; track room.id) {
              <div>
                <strong>Room {{ room.roomNumber }} · {{ room.type }}</strong>
                <span>{{ room.status }} · {{ room.capacity }} guests · {{ room.rate | currency: 'INR' : 'symbol' : '1.0-0' }}</span>
              </div>
            }
          </div>
        </article>
      </div>
    </section>
  `
})
export class AdminDashboardPageComponent {
  protected readonly headline = roleHeadlines.admin;
  protected readonly metrics = roleMetrics.admin;
  protected readonly bookings = demoBookings;
  protected readonly rooms = demoRooms;
  protected readonly users = demoUsers;
}
