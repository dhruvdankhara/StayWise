import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map, switchMap } from 'rxjs';

import { BookingService } from '../../core/services/booking.service';

@Component({
  selector: 'app-booking-confirmation-page',
  imports: [AsyncPipe, CurrencyPipe, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (booking$ | async; as booking) {
      <section class="section container">
        <article class="surface section-panel">
          <p class="eyebrow">Booking confirmation</p>
          <h1>{{ booking.bookingRef }}</h1>
          <p>Your reservation is now created in the system.</p>
          <div class="stack-list">
            <div><strong>{{ booking.room?.type || 'Room assigned' }}</strong><span>Room {{ booking.room?.roomNumber || 'TBD' }}</span></div>
            <div><strong>{{ booking.checkIn }} to {{ booking.checkOut }}</strong><span>Status: {{ booking.status }}</span></div>
            <div><strong>{{ booking.totalAmount | currency: 'INR' : 'symbol' : '1.0-0' }}</strong><span>Payment status: {{ booking.paymentStatus }}</span></div>
          </div>
          <div class="button-row">
            <a routerLink="/guest/bookings" class="button">Open my bookings</a>
            <a routerLink="/rooms" class="button button--ghost">Back to rooms</a>
          </div>
        </article>
      </section>
    }
  `
})
export class BookingConfirmationPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly bookingService = inject(BookingService);

  readonly booking$ = this.route.paramMap.pipe(
    map((params) => params.get('bookingId') ?? ''),
    switchMap((bookingId) => this.bookingService.getBooking(bookingId))
  );
}
