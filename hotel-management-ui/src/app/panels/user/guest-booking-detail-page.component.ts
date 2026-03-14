import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom, map, switchMap } from 'rxjs';

import { BillingService } from '../../core/services/billing.service';
import { BookingService } from '../../core/services/booking.service';
import { ReviewService } from '../../core/services/review.service';

@Component({
  selector: 'app-guest-booking-detail-page',
  imports: [AsyncPipe, CurrencyPipe, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (booking$ | async; as booking) {
      <section class="section">
        <div class="section-grid">
          <article class="surface section-panel">
            <p class="eyebrow">Booking detail</p>
            <h1>{{ booking.bookingRef }}</h1>
            <div class="stack-list">
              <div><strong>{{ booking.room?.type || 'Room' }}</strong><span>Room {{ booking.room?.roomNumber || 'TBD' }}</span></div>
              <div><strong>{{ booking.checkIn }} to {{ booking.checkOut }}</strong><span>Status: {{ booking.status }}</span></div>
              <div><strong>{{ booking.totalAmount | currency: 'INR' : 'symbol' : '1.0-0' }}</strong><span>Payment status: {{ booking.paymentStatus }}</span></div>
            </div>
            <div class="button-row">
              <button type="button" class="button button--ghost" (click)="downloadInvoice(booking.id)">Download invoice PDF</button>
              <button type="button" class="button button--ghost" (click)="cancel(booking.id)">Cancel booking</button>
            </div>
          </article>
          <form class="surface auth-form" [formGroup]="reviewForm" (ngSubmit)="submitReview(booking.id, booking.room?.id || '')">
            <p class="eyebrow">Leave a review</p>
            <label><span>Rating</span><input type="number" min="1" max="5" formControlName="rating" /></label>
            <label><span>Comment</span><input type="text" formControlName="comment" /></label>
            @if (message()) { <p>{{ message() }}</p> }
            @if (error()) { <p class="error-text">{{ error() }}</p> }
            <button type="submit" class="button button--full">Submit review</button>
          </form>
        </div>
      </section>
    }
  `
})
export class GuestBookingDetailPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly formBuilder = inject(FormBuilder);
  private readonly bookingService = inject(BookingService);
  private readonly billingService = inject(BillingService);
  private readonly reviewService = inject(ReviewService);

  readonly error = signal('');
  readonly message = signal('');
  readonly reviewForm = this.formBuilder.nonNullable.group({
    rating: 5,
    comment: ''
  });
  readonly booking$ = this.route.paramMap.pipe(
    map((params) => params.get('id') ?? ''),
    switchMap((bookingId) => this.bookingService.getBooking(bookingId))
  );

  async cancel(bookingId: string): Promise<void> {
    this.message.set('');
    this.error.set('');
    try {
      await firstValueFrom(this.bookingService.cancelBooking(bookingId, 'Cancelled by guest from self-service portal'));
      this.message.set('Booking cancelled successfully.');
    } catch {
      this.error.set('Unable to cancel this booking.');
    }
  }

  async downloadInvoice(bookingId: string): Promise<void> {
    try {
      const blob = await firstValueFrom(this.billingService.downloadInvoicePdf(bookingId));
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank', 'noopener');
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      this.error.set('Unable to download the invoice.');
    }
  }

  async submitReview(bookingId: string, roomId: string): Promise<void> {
    this.message.set('');
    this.error.set('');
    try {
      await firstValueFrom(
        this.reviewService.submitReview({
          bookingId,
          roomId,
          ...this.reviewForm.getRawValue()
        })
      );
      this.message.set('Review submitted successfully.');
    } catch {
      this.error.set('Review submission is only available after checkout.');
    }
  }
}
