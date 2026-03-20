import { AsyncPipe, CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map, switchMap } from 'rxjs';

import { BookingService } from '../../core/services/booking.service';

@Component({
  selector: 'app-booking-confirmation-page',
  imports: [AsyncPipe, CurrencyPipe, RouterLink, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="animate-fade-in pb-24 pt-12 text-center min-h-[80vh] flex flex-col items-center justify-center relative"
    >
      <!-- Ambient background decorations -->
      <div
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-125 bg-emerald-500/10 blur-[100px] rounded-full point-events-none -z-10"
      ></div>

      @if (booking$ | async; as booking) {
        <section class="w-full max-w-xl mx-auto px-4 sm:px-6 relative z-10">
          <article
            class="surface p-10 sm:p-14 border border-white/60 shadow-xl rounded-[2.5rem] bg-white/80 backdrop-blur-xl relative overflow-hidden text-center"
          >
            <!-- Success Icon -->
            <div
              class="w-20 h-20 mx-auto rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-8 relative after:absolute after:inset-0 after:rounded-full after:animate-ping after:bg-emerald-400/20"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>

            <p class="text-sm font-bold text-emerald-600 uppercase tracking-widest mb-3">
              Booking Confirmed
            </p>
            <h1 class="text-4xl font-bold tracking-tight text-neutral-900 mb-2">
              {{ booking.bookingRef }}
            </h1>
            <p class="text-neutral-500 mb-10">
              Your reservation has been successfully created and secured.
            </p>

            <div class="grid grid-cols-1 gap-4 mb-10 text-left">
              <div
                class="flex items-center gap-4 p-4 rounded-2xl bg-white/50 border border-black/5"
              >
                <div
                  class="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 shrink-0"
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
                  >
                    <path
                      d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                    ></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </div>
                <div>
                  <strong class="block text-sm text-neutral-900">{{
                    booking.room?.type || 'Room assigned'
                  }}</strong>
                  <span class="text-xs text-neutral-500"
                    >Room {{ booking.room?.roomNumber || 'TBD' }}</span
                  >
                </div>
              </div>

              <div
                class="flex items-center gap-4 p-4 rounded-2xl bg-white/50 border border-black/5"
              >
                <div
                  class="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 shrink-0"
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
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                </div>
                <div class="flex-1">
                  <strong class="block text-sm text-neutral-900"
                    >{{ booking.checkIn | date: 'mediumDate' }} —
                    {{ booking.checkOut | date: 'mediumDate' }}</strong
                  >
                  <span
                    class="text-xs font-medium"
                    [class.text-amber-600]="booking.status !== 'CONFIRMED'"
                    [class.text-emerald-600]="booking.status === 'CONFIRMED'"
                    >Status: {{ booking.status }}</span
                  >
                </div>
              </div>

              <div
                class="flex items-center gap-4 p-4 rounded-2xl bg-white/50 border border-black/5"
              >
                <div
                  class="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 shrink-0"
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
                  >
                    <line x1="12" y1="1" x2="12" y2="23"></line>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                  </svg>
                </div>
                <div class="flex-1">
                  <strong class="block text-sm text-neutral-900">{{
                    booking.totalAmount | currency: 'INR' : 'symbol' : '1.0-0'
                  }}</strong>
                  <span
                    class="text-xs font-medium"
                    [class.text-amber-600]="booking.paymentStatus === 'PENDING'"
                    [class.text-emerald-600]="booking.paymentStatus === 'PAID'"
                    >Payment: {{ booking.paymentStatus }}</span
                  >
                </div>
              </div>
            </div>

            <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                routerLink="/guest/bookings"
                class="button w-full sm:w-auto justify-center bg-amber-800 hover:bg-amber-900 border-0 shadow-lg shadow-amber-900/20 hover:scale-[1.02] transition-transform"
              >
                Open my bookings
              </a>
              <a
                routerLink="/rooms"
                class="button w-full sm:w-auto justify-center bg-white text-neutral-700 hover:bg-neutral-50 hover:text-black hover:scale-[1.02] border border-black/10 shadow-sm transition-colors"
              >
                Back to rooms
              </a>
            </div>
          </article>
        </section>
      }
    </div>
  `,
})
export class BookingConfirmationPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly bookingService = inject(BookingService);

  readonly booking$ = this.route.paramMap.pipe(
    map((params) => params.get('bookingId') ?? ''),
    switchMap((bookingId) => this.bookingService.getBooking(bookingId)),
  );
}
