import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { BookingService } from '../../core/services/booking.service';

@Component({
  selector: 'app-guest-issues-page',
  imports: [AsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Issue reporting</p>
          <h1>Current and recent stays that may need escalation.</h1>
          <p>The current backend does not expose a dedicated issue endpoint, so this page anchors support around booking records.</p>
        </div>
      </div>
      @if (bookings$ | async; as bookings) {
        <div class="card-grid">
          @for (booking of bookings; track booking.id) {
            <article class="surface review-card">
              <p class="pill">{{ booking.status }}</p>
              <h3>{{ booking.room?.type || 'Room stay' }}</h3>
              <p>Reference {{ booking.bookingRef }} · {{ booking.checkIn }} to {{ booking.checkOut }}</p>
              <strong>Contact hotel manager with this booking reference.</strong>
            </article>
          }
        </div>
      }
    </section>
  `
})
export class GuestIssuesPageComponent {
  private readonly bookingService = inject(BookingService);
  readonly bookings$ = this.bookingService.listMyBookings();
}
