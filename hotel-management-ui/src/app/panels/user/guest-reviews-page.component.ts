import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { map } from 'rxjs';

import { BookingService } from '../../core/services/booking.service';

@Component({
  selector: 'app-guest-reviews-page',
  imports: [AsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Reviews and feedback</p>
          <h1>Completed stays that are eligible for feedback.</h1>
        </div>
      </div>
      @if (eligibleBookings$ | async; as bookings) {
        <div class="card-grid">
          @for (booking of bookings; track booking.id) {
            <article class="surface review-card">
              <p class="pill">{{ booking.status }}</p>
              <h3>{{ booking.room?.type || 'Room stay' }}</h3>
              <p>Completed stay on {{ booking.checkOut }}. Open the booking detail page to submit or update your review.</p>
              <strong>{{ booking.bookingRef }}</strong>
            </article>
          } @empty {
            <article class="surface review-card">
              <h3>No completed stays yet</h3>
              <p>Reviews unlock after checkout.</p>
            </article>
          }
        </div>
      }
    </section>
  `
})
export class GuestReviewsPageComponent {
  private readonly bookingService = inject(BookingService);
  readonly eligibleBookings$ = this.bookingService.listMyBookings().pipe(
    map((bookings) => bookings.filter((booking) => booking.status === 'checked_out'))
  );
}
