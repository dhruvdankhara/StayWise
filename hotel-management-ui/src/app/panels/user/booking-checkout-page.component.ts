import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom, map, switchMap } from 'rxjs';

import { BookingService } from '../../core/services/booking.service';
import { RoomService } from '../../core/services/room.service';

@Component({
  selector: 'app-booking-checkout-page',
  imports: [AsyncPipe, CurrencyPipe, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (room$ | async; as room) {
      <section class="section container">
        <div class="section-grid">
          <article class="surface section-panel">
            <p class="eyebrow">Booking checkout</p>
            <h1>{{ room.type }}</h1>
            <p>Confirm dates, guest count, and preferences to create the reservation.</p>
            <div class="stack-list">
              <div><strong>Room {{ room.roomNumber }}</strong><span>Floor {{ room.floor }} · {{ room.capacity }} guests</span></div>
              <div><strong>{{ room.baseRate | currency: 'INR' : 'symbol' : '1.0-0' }}</strong><span>Nightly base rate before taxes and extras</span></div>
            </div>
          </article>
          <form class="surface auth-form" [formGroup]="form" (ngSubmit)="submit()">
            <label><span>Check-in</span><input type="datetime-local" formControlName="checkIn" /></label>
            <label><span>Check-out</span><input type="datetime-local" formControlName="checkOut" /></label>
            <label><span>Guests</span><input type="number" min="1" formControlName="guests" /></label>
            <label><span>Special requests</span><input type="text" formControlName="specialRequests" /></label>
            @if (error()) { <p class="error-text">{{ error() }}</p> }
            <button type="submit" class="button button--full">Create booking</button>
          </form>
        </div>
      </section>
    }
  `
})
export class BookingCheckoutPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly formBuilder = inject(FormBuilder);
  private readonly roomService = inject(RoomService);
  private readonly bookingService = inject(BookingService);

  readonly error = signal('');
  readonly room$ = this.route.paramMap.pipe(
    map((params) => params.get('roomId') ?? ''),
    switchMap((roomId) => this.roomService.getRoom(roomId))
  );

  readonly form = this.formBuilder.nonNullable.group({
    checkIn: ['', Validators.required],
    checkOut: ['', Validators.required],
    guests: [1, [Validators.required, Validators.min(1)]],
    specialRequests: ['']
  });

  async submit(): Promise<void> {
    this.error.set('');

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const roomId = this.route.snapshot.paramMap.get('roomId') ?? '';

    try {
      const booking = await firstValueFrom(
        this.bookingService.createBooking({
          roomId,
          ...this.form.getRawValue(),
          checkIn: new Date(this.form.getRawValue().checkIn).toISOString(),
          checkOut: new Date(this.form.getRawValue().checkOut).toISOString()
        })
      );
      await this.router.navigate(['/booking/confirmation', booking.id]);
    } catch {
      this.error.set('Unable to create the booking.');
    }
  }
}
