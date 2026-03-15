import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { BehaviorSubject, firstValueFrom, map, switchMap } from 'rxjs';

import { BookingService } from '../../core/services/booking.service';

@Component({
  selector: 'app-receptionist-check-in-page',
  imports: [AsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Check-in</p>
          <h1>Verify and check in arriving guests.</h1>
        </div>
      </div>
      @if (bookings$ | async; as bookings) {
        <div class="card-grid">
          @for (booking of bookings; track booking.id) {
            <article class="surface review-card">
              <p class="pill">{{ booking.status }}</p>
              <h3>{{ booking.guest?.name || booking.bookingRef }}</h3>
              <p>{{ booking.room?.type || 'Room stay' }} · {{ booking.checkIn }}</p>
              <button type="button" class="button" (click)="checkIn(booking.id)">Perform check-in</button>
            </article>
          }
        </div>
      }
      @if (message()) { <p>{{ message() }}</p> }
      @if (error()) { <p class="error-text">{{ error() }}</p> }
    </section>
  `
})
export class ReceptionistCheckInPageComponent {
  private readonly bookingService = inject(BookingService);
  private readonly refresh$ = new BehaviorSubject<void>(undefined);
  readonly message = signal('');
  readonly error = signal('');
  readonly bookings$ = this.refresh$.pipe(
    switchMap(() => this.bookingService.listBookings({ status: 'confirmed' })),
    map((result) => result.items)
  );

  async checkIn(id: string): Promise<void> {
    try {
      await firstValueFrom(this.bookingService.checkIn(id));
      this.message.set('Guest checked in successfully.');
      this.refresh$.next();
    } catch {
      this.error.set('Unable to complete check-in.');
    }
  }
}
