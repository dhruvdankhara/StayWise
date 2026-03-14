import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { map } from 'rxjs';

import { AuthService } from '../../core/services/auth.service';
import { BookingService } from '../../core/services/booking.service';
import { MetricCardComponent } from '../../shared/components/metric-card.component';

@Component({
  selector: 'app-guest-overview-page',
  imports: [AsyncPipe, MetricCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (vm$ | async; as vm) {
      <section class="section">
        <div class="section-heading">
          <div>
            <p class="eyebrow">Guest dashboard</p>
            <h1>Welcome back, {{ vm.userName }}.</h1>
            <p>Self-service booking management, invoices, profile updates, and review submission.</p>
          </div>
        </div>
        <div class="card-grid card-grid--three">
          @for (metric of vm.metrics; track metric.label) {
            <app-metric-card [label]="metric.label" [value]="metric.value" [change]="metric.hint" />
          }
        </div>
      </section>
    }
  `
})
export class GuestOverviewPageComponent {
  private readonly authService = inject(AuthService);
  private readonly bookingService = inject(BookingService);

  readonly vm$ = this.bookingService.listMyBookings().pipe(
    map((bookings) => ({
      userName: this.authService.user()?.name ?? 'Guest',
      metrics: [
        {
          label: 'Bookings',
          value: String(bookings.length),
          hint: 'All reservations attached to your account'
        },
        {
          label: 'Upcoming stays',
          value: String(bookings.filter((item) => item.status !== 'checked_out' && item.status !== 'cancelled').length),
          hint: 'Future or active reservations'
        },
        {
          label: 'Completed stays',
          value: String(bookings.filter((item) => item.status === 'checked_out').length),
          hint: 'Eligible for review submission'
        }
      ]
    }))
  );
}
