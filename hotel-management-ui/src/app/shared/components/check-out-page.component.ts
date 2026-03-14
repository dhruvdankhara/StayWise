import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { BehaviorSubject, firstValueFrom, map, switchMap } from 'rxjs';

import { BookingService } from '../../core/services/booking.service';

@Component({
  selector: 'app-check-out-page',
  imports: [AsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Check-out</p>
          <h1>Finalize stays and trigger housekeeping turnover.</h1>
        </div>
      </div>
      @if (bookings$ | async; as bookings) {
        <div class="card-grid">
          @for (booking of bookings; track booking.id) {
            <article class="surface review-card">
              <p class="pill">{{ booking.paymentStatus }}</p>
              <h3>{{ booking.guest?.name || booking.bookingRef }}</h3>
              <p>{{ booking.room?.type || 'Room stay' }} · {{ booking.checkOut }}</p>
              <button type="button" class="button" (click)="checkOut(booking.id)">Perform check-out</button>
            </article>
          }
        </div>
      }
      @if (message()) { <p>{{ message() }}</p> }
      @if (error()) { <p class="error-text">{{ error() }}</p> }
    </section>
  `
})
export class CheckOutPageComponent {
  private readonly bookingService = inject(BookingService);
  private readonly refresh$ = new BehaviorSubject<void>(undefined);
  readonly message = signal('');
  readonly error = signal('');
  readonly bookings$ = this.refresh$.pipe(
    switchMap(() => this.bookingService.listBookings({ status: 'checked_in' })),
    map((result) => result.items)
  );

  async checkOut(id: string): Promise<void> {
    try {
      await firstValueFrom(this.bookingService.checkOut(id));
      this.message.set('Guest checked out successfully.');
      this.refresh$.next();
    } catch {
      this.error.set('Unable to complete check-out.');
    }
  }
}
