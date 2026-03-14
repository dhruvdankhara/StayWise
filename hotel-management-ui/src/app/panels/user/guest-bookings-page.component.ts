import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { demoBookings } from '../../core/data/demo-data';

@Component({
  selector: 'app-guest-bookings-page',
  imports: [CurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section">
      <div class="section-heading">
        <div>
          <p class="eyebrow">My bookings</p>
          <h1>Upcoming, active, and past stays.</h1>
        </div>
      </div>
      <div class="table-shell surface">
        <table>
          <thead>
            <tr><th>Reference</th><th>Room</th><th>Dates</th><th>Status</th><th>Total</th></tr>
          </thead>
          <tbody>
            @for (booking of bookings; track booking.id) {
              <tr>
                <td>{{ booking.ref }}</td>
                <td>{{ booking.roomType }}</td>
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
export class GuestBookingsPageComponent {
  protected readonly bookings = demoBookings;
}
