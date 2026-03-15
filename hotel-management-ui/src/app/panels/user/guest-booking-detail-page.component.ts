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
    <div class="animate-fade-in pb-20 pt-8 text-left">
      @if (booking$ | async; as booking) {
        <section class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            class="mb-8 relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4"
          >
            <div>
              <div
                class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-950/5 border border-orange-900/10 mb-4"
              >
                <span class="w-2 h-2 rounded-full bg-amber-600 animate-pulse"></span>
                <p class="eyebrow !m-0 !text-xs text-amber-800">Booking Detail</p>
              </div>
              <h1
                class="text-3xl md:text-5xl font-bold tracking-tight text-neutral-900 flex items-center gap-3"
              >
                Ref: <span class="text-amber-700 font-mono">{{ booking.bookingRef }}</span>
              </h1>
            </div>

            <div class="flex flex-wrap gap-2">
              <span
                class="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-neutral-200 text-neutral-800 text-xs font-bold uppercase tracking-wider rounded-full shadow-sm max-h-[34px]"
                [class.bg-emerald-50]="booking.status === 'CONFIRMED'"
                [class.text-emerald-700]="booking.status === 'CONFIRMED'"
                [class.border-emerald-200]="booking.status === 'CONFIRMED'"
              >
                <span
                  class="w-1.5 h-1.5 rounded-full bg-neutral-400"
                  [class.bg-emerald-500]="booking.status === 'CONFIRMED'"
                ></span>
                {{ booking.status }}
              </span>
              <span
                class="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-neutral-200 text-neutral-800 text-xs font-bold uppercase tracking-wider rounded-full shadow-sm max-h-[34px]"
                [class.bg-emerald-50]="booking.paymentStatus === 'PAID'"
                [class.text-emerald-700]="booking.paymentStatus === 'PAID'"
                [class.border-emerald-200]="booking.paymentStatus === 'PAID'"
              >
                <span
                  class="w-1.5 h-1.5 rounded-full bg-neutral-400"
                  [class.bg-emerald-500]="booking.paymentStatus === 'PAID'"
                ></span>
                {{ booking.paymentStatus }}
              </span>
            </div>
          </div>

          <div class="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start relative z-10">
            <article
              class="xl:col-span-2 surface relative border border-white/60 shadow-xl rounded-[2rem] p-6 md:p-10 backdrop-blur-xl bg-white/80 overflow-hidden"
            >
              <div
                class="absolute -top-32 -right-32 w-64 h-64 bg-amber-600/10 rounded-full blur-[80px] z-0"
              ></div>

              <div class="relative z-10">
                <div
                  class="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-8 border-b border-black/5"
                >
                  <div class="flex items-center gap-5">
                    <div
                      class="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 shrink-0"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path d="M2 22h20"></path>
                        <path d="M4 2v20"></path>
                        <path d="M20 2v20"></path>
                        <path d="M10 22V8a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v14"></path>
                        <path d="M14 12V2h-4v10"></path>
                      </svg>
                    </div>
                    <div>
                      <p
                        class="text-sm font-semibold text-neutral-500 mb-1 uppercase tracking-wider"
                      >
                        Room Assigned
                      </p>
                      <h2 class="text-3xl font-bold text-neutral-900 mb-1">
                        {{ booking.room?.type || 'Standard Room' }}
                      </h2>
                      <p class="text-neutral-600 font-medium flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          class="text-amber-700/70"
                        >
                          <path
                            d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                          ></path>
                          <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                        Room {{ booking.room?.roomNumber || 'TBD' }}
                      </p>
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 border-b border-black/5">
                  <div class="flex items-start gap-4">
                    <div
                      class="w-12 h-12 rounded-2xl bg-orange-50 border border-amber-900/10 flex items-center justify-center text-amber-800 shrink-0"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                    </div>
                    <div>
                      <p
                        class="text-sm font-semibold text-neutral-500 mb-1 uppercase tracking-wider"
                      >
                        Stay Dates
                      </p>
                      <p class="text-lg text-neutral-900 font-medium break-words leading-snug">
                        {{ booking.checkIn }} <br /><span class="text-neutral-400 text-sm">to</span>
                        <br />{{ booking.checkOut }}
                      </p>
                    </div>
                  </div>

                  <div class="flex items-start gap-4">
                    <div
                      class="w-12 h-12 rounded-2xl bg-orange-50 border border-amber-900/10 flex items-center justify-center text-amber-800 shrink-0"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <line x1="12" y1="1" x2="12" y2="23"></line>
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                      </svg>
                    </div>
                    <div>
                      <p
                        class="text-sm font-semibold text-neutral-500 mb-1 uppercase tracking-wider"
                      >
                        Total Amount
                      </p>
                      <p class="text-3xl text-neutral-900 font-bold leading-none">
                        {{ booking.totalAmount | currency: 'INR' : 'symbol' : '1.0-0' }}
                      </p>
                    </div>
                  </div>
                </div>

                <div class="flex flex-col sm:flex-row gap-4 pt-8">
                  <button
                    type="button"
                    class="inline-flex flex-1 items-center justify-center px-6 py-3.5 rounded-xl bg-white border border-neutral-200 hover:border-amber-300 hover:bg-amber-50 text-neutral-800 hover:text-amber-900 font-semibold transition-all shadow-sm hover:shadow"
                    (click)="downloadInvoice(booking.id)"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="mr-2.5"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    Download Invoice PDF
                  </button>
                  <button
                    type="button"
                    class="inline-flex flex-1 items-center justify-center px-6 py-3.5 rounded-xl bg-white border border-red-200 hover:border-red-300 hover:bg-red-50 text-red-600 font-semibold transition-all shadow-sm hover:shadow group"
                    (click)="cancel(booking.id)"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="mr-2.5 group-hover:rotate-90 transition-transform duration-300"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                    Cancel Booking
                  </button>
                </div>
              </div>
            </article>

            <form
              class="surface xl:col-span-1 border border-white/60 shadow-xl rounded-[2rem] p-6 lg:p-8 backdrop-blur-xl bg-orange-50/60 flex flex-col gap-6"
              [formGroup]="reviewForm"
              (ngSubmit)="submitReview(booking.id, booking.room?.id || '')"
            >
              <div class="flex items-center gap-3 mb-2">
                <div
                  class="w-12 h-12 rounded-full bg-white border border-amber-900/10 shadow-sm flex items-center justify-center text-amber-600 shrink-0"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <polygon
                      points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                    ></polygon>
                  </svg>
                </div>
                <div>
                  <h3 class="text-xl font-bold text-neutral-900 leading-tight">Leave a Review</h3>
                  <p class="text-sm text-neutral-500">Share your experience</p>
                </div>
              </div>

              <label class="flex flex-col gap-2">
                <span class="text-sm font-semibold text-neutral-700">Rating Snapshot (1-5)</span>
                <div class="relative">
                  <input
                    type="number"
                    min="1"
                    max="5"
                    formControlName="rating"
                    class="w-full pl-4 pr-10 py-3 rounded-xl border border-neutral-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all text-neutral-900 font-bold"
                  />
                  <div
                    class="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-amber-400 fill-current"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <polygon
                        points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                      ></polygon>
                    </svg>
                  </div>
                </div>
              </label>

              <label class="flex flex-col gap-2">
                <span class="text-sm font-semibold text-neutral-700">Your comments</span>
                <!-- Replaced text input with a textarea for better UX -->
                <textarea
                  formControlName="comment"
                  rows="4"
                  class="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all resize-none placeholder:text-neutral-400"
                  placeholder="How was the hospitality?"
                ></textarea>
              </label>

              @if (message()) {
                <div
                  class="p-3.5 rounded-xl bg-emerald-50 border border-emerald-100 flex items-start gap-3"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="text-emerald-600 shrink-0 mt-0.5"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  <p class="text-sm font-medium text-emerald-800 m-0">{{ message() }}</p>
                </div>
              }

              @if (error()) {
                <div
                  class="p-3.5 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="text-red-600 shrink-0 mt-0.5"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  <p class="text-sm font-medium text-red-800 m-0">{{ error() }}</p>
                </div>
              }

              <button
                type="submit"
                class="button w-full shadow-lg shadow-amber-900/20 hover:scale-[1.02] transition-transform duration-200 py-3.5 mt-2 flex items-center justify-center gap-2 text-base"
              >
                Submit review
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </form>
          </div>
        </section>
      }
    </div>
  `,
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
    comment: '',
  });
  readonly booking$ = this.route.paramMap.pipe(
    map((params) => params.get('id') ?? ''),
    switchMap((bookingId) => this.bookingService.getBooking(bookingId)),
  );

  async cancel(bookingId: string): Promise<void> {
    this.message.set('');
    this.error.set('');
    try {
      await firstValueFrom(
        this.bookingService.cancelBooking(bookingId, 'Cancelled by guest from self-service portal'),
      );
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
          ...this.reviewForm.getRawValue(),
        }),
      );
      this.message.set('Review submitted successfully.');
    } catch {
      this.error.set('Review submission is only available after checkout.');
    }
  }
}
