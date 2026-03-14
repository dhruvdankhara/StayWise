import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, firstValueFrom, map, switchMap } from 'rxjs';

import { BookingService } from '../../core/services/booking.service';

@Component({
  selector: 'app-booking-workspace-page',
  imports: [AsyncPipe, CurrencyPipe, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section">
      <div class="section-heading">
        <div>
          <p class="eyebrow">{{ title().eyebrow }}</p>
          <h1>{{ title().title }}</h1>
          <p>{{ title().description }}</p>
        </div>
      </div>
      <div class="section-grid">
        <form class="surface auth-form" [formGroup]="form" (ngSubmit)="save()">
          <p class="eyebrow">{{ editingId() ? 'Edit booking' : 'Create booking' }}</p>
          <label><span>Guest ID</span><input type="text" formControlName="guestId" /></label>
          <label><span>Room ID</span><input type="text" formControlName="roomId" /></label>
          <label><span>Check-in</span><input type="datetime-local" formControlName="checkIn" /></label>
          <label><span>Check-out</span><input type="datetime-local" formControlName="checkOut" /></label>
          <label><span>Guests</span><input type="number" min="1" formControlName="guests" /></label>
          <label><span>Special requests</span><input type="text" formControlName="specialRequests" /></label>
          @if (message()) { <p>{{ message() }}</p> }
          @if (error()) { <p class="error-text">{{ error() }}</p> }
          <div class="button-row">
            <button type="submit" class="button">{{ editingId() ? 'Save changes' : 'Create booking' }}</button>
            @if (editingId()) {
              <button type="button" class="button button--ghost" (click)="reset()">Reset</button>
            }
          </div>
        </form>
        <div class="surface table-shell">
          @if (bookings$ | async; as bookings) {
            <table>
              <thead><tr><th>Reference</th><th>Guest</th><th>Room</th><th>Status</th><th>Total</th><th></th></tr></thead>
              <tbody>
                @for (booking of bookings; track booking.id) {
                  <tr>
                    <td>{{ booking.bookingRef }}</td>
                    <td>{{ booking.guest?.name || booking.guest?.id || 'Guest' }}</td>
                    <td>{{ booking.room?.type || booking.room?.id || 'Room' }}</td>
                    <td><span class="pill">{{ booking.status }}</span></td>
                    <td>{{ booking.totalAmount | currency: 'INR' : 'symbol' : '1.0-0' }}</td>
                    <td>
                      <button type="button" class="button button--ghost" (click)="edit(booking.id)">Edit</button>
                      <button type="button" class="button button--ghost" (click)="cancel(booking.id)">Cancel</button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          }
        </div>
      </div>
    </section>
  `
})
export class BookingWorkspacePageComponent {
  private readonly bookingService = inject(BookingService);
  private readonly route = inject(ActivatedRoute);
  private readonly formBuilder = inject(FormBuilder);
  private readonly refresh$ = new BehaviorSubject<void>(undefined);

  readonly message = signal('');
  readonly error = signal('');
  readonly editingId = signal<string | null>(null);
  readonly form = this.formBuilder.nonNullable.group({
    guestId: ['', Validators.required],
    roomId: ['', Validators.required],
    checkIn: ['', Validators.required],
    checkOut: ['', Validators.required],
    guests: [1, [Validators.required, Validators.min(1)]],
    specialRequests: ['']
  });

  readonly title = signal(this.route.snapshot.data as { eyebrow: string; title: string; description: string });
  readonly bookings$ = this.refresh$.pipe(
    switchMap(() => this.bookingService.listBookings()),
    map((result) => result.items)
  );

  async save(): Promise<void> {
    this.error.set('');
    this.message.set('');

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = {
      ...this.form.getRawValue(),
      checkIn: new Date(this.form.getRawValue().checkIn).toISOString(),
      checkOut: new Date(this.form.getRawValue().checkOut).toISOString()
    };

    try {
      if (this.editingId()) {
        await firstValueFrom(this.bookingService.updateBooking(this.editingId()!, payload));
        this.message.set('Booking updated successfully.');
      } else {
        await firstValueFrom(this.bookingService.createBooking(payload));
        this.message.set('Booking created successfully.');
      }
      this.reset();
      this.refresh$.next();
    } catch {
      this.error.set('Unable to save the booking.');
    }
  }

  async edit(id: string): Promise<void> {
    this.error.set('');
    const booking = await firstValueFrom(this.bookingService.getBooking(id));
    this.editingId.set(id);
    this.form.setValue({
      guestId: booking.guest?.id ?? '',
      roomId: booking.room?.id ?? '',
      checkIn: booking.checkIn.slice(0, 16),
      checkOut: booking.checkOut.slice(0, 16),
      guests: booking.guests,
      specialRequests: booking.specialRequests ?? ''
    });
  }

  async cancel(id: string): Promise<void> {
    try {
      await firstValueFrom(this.bookingService.cancelBooking(id, 'Cancelled from bookings workspace'));
      this.message.set('Booking cancelled.');
      this.refresh$.next();
    } catch {
      this.error.set('Unable to cancel the booking.');
    }
  }

  reset(): void {
    this.editingId.set(null);
    this.form.reset({
      guestId: '',
      roomId: '',
      checkIn: '',
      checkOut: '',
      guests: 1,
      specialRequests: ''
    });
  }
}
