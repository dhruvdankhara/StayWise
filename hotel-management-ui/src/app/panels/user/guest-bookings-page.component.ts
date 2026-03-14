import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { BookingService } from '../../core/services/booking.service';

@Component({
  selector: 'app-guest-bookings-page',
  imports: [AsyncPipe, CurrencyPipe, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section">
      <div class="section-heading">
        <div>
          <p class="eyebrow">My bookings</p>
          <h1>Upcoming, active, and completed stays.</h1>
        </div>
      </div>
      @if (bookings$ | async; as bookings) {
        <div class="table-shell surface">
          <table>
            <thead>
              <tr><th>Reference</th><th>Room</th><th>Dates</th><th>Status</th><th>Total</th><th></th></tr>
            </thead>
            <tbody>
              @for (booking of bookings; track booking.id) {
                <tr>
                  <td>{{ booking.bookingRef }}</td>
                  <td>{{ booking.room?.type || 'Room stay' }}</td>
                  <td>{{ booking.checkIn }} to {{ booking.checkOut }}</td>
                  <td><span class="pill">{{ booking.status }}</span></td>
                  <td>{{ booking.totalAmount | currency: 'INR' : 'symbol' : '1.0-0' }}</td>
                  <td><a [routerLink]="['/guest/bookings', booking.id]">Open</a></td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </section>
  `
})
export class GuestBookingsPageComponent {
  private readonly bookingService = inject(BookingService);
  readonly bookings$ = this.bookingService.listMyBookings();
}
