import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { map } from 'rxjs';

import { BookingService } from '../../core/services/booking.service';

@Component({
  selector: 'app-receptionist-guests-page',
  imports: [AsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Guest management</p>
          <h1>Guest history and current reservations derived from booking records.</h1>
        </div>
      </div>
      @if (guests$ | async; as guests) {
        <div class="table-shell surface">
          <table>
            <thead><tr><th>Guest</th><th>Email</th><th>Phone</th><th>Latest booking</th></tr></thead>
            <tbody>
              @for (guest of guests; track guest.id) {
                <tr>
                  <td>{{ guest.name }}</td>
                  <td>{{ guest.email || 'N/A' }}</td>
                  <td>{{ guest.phone || 'N/A' }}</td>
                  <td>{{ guest.latestBooking }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </section>
  `
})
export class ReceptionistGuestsPageComponent {
  private readonly bookingService = inject(BookingService);
  readonly guests$ = this.bookingService.listBookings().pipe(
    map((result) =>
      result.items.reduce<Array<{ id: string; name: string; email?: string; phone?: string; latestBooking: string }>>(
        (accumulator, booking) => {
          if (!booking.guest) {
            return accumulator;
          }

          const existing = accumulator.find((item) => item.id === booking.guest!.id);
          if (existing) {
            existing.latestBooking = booking.bookingRef;
            return accumulator;
          }

          accumulator.push({
            id: booking.guest.id,
            name: booking.guest.name,
            email: booking.guest.email,
            phone: booking.guest.phone,
            latestBooking: booking.bookingRef
          });
          return accumulator;
        },
        []
      )
    )
  );
}
