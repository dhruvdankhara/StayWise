import { AsyncPipe, CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { BookingService } from '../../core/services/booking.service';

@Component({
  selector: 'app-guest-bookings-page',
  imports: [AsyncPipe, CurrencyPipe, RouterLink, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="animate-fade-in relative z-10 max-w-7xl mx-auto">
      <section class="mb-10 lg:mb-14">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p
              class="text-sm font-bold text-amber-700 uppercase tracking-widest mb-3 flex items-center gap-2"
            >
              <span class="w-2 h-2 rounded-full bg-amber-500"></span>
              My bookings
            </p>
            <h1 class="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900">
              Your recent reservations.
            </h1>
            <p class="text-lg text-neutral-600 mt-4 max-w-2xl">
              Upcoming, active, and completed stays managed within your account.
            </p>
          </div>
          <a
            routerLink="/rooms"
            class="inline-flex items-center justify-center px-5 py-3 text-sm font-semibold rounded-2xl bg-white border border-black/10 text-neutral-700 hover:bg-neutral-50 hover:text-black transition-colors shadow-sm whitespace-nowrap gap-2"
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
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Book New Stay
          </a>
        </div>
      </section>

      @if (bookings$ | async; as bookings) {
        <div
          class="surface rounded-[2.5rem] bg-white shadow-sm border border-black/5 overflow-hidden"
        >
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse min-w-200">
              <thead>
                <tr class="bg-neutral-50/80 border-b border-black/5">
                  <th
                    class="py-5 px-6 font-bold text-xs uppercase tracking-widest text-neutral-500 w-[15%]"
                  >
                    Reference
                  </th>
                  <th
                    class="py-5 px-6 font-bold text-xs uppercase tracking-widest text-neutral-500 w-[20%]"
                  >
                    Room
                  </th>
                  <th
                    class="py-5 px-6 font-bold text-xs uppercase tracking-widest text-neutral-500 w-[25%]"
                  >
                    Dates
                  </th>
                  <th
                    class="py-5 px-6 font-bold text-xs uppercase tracking-widest text-neutral-500 w-[15%]"
                  >
                    Status
                  </th>
                  <th
                    class="py-5 px-6 font-bold text-xs uppercase tracking-widest text-neutral-500 w-[15%]"
                  >
                    Total
                  </th>
                  <th
                    class="py-5 px-6 font-bold text-xs uppercase tracking-widest text-neutral-500 w-[10%] text-right"
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-black/5 align-middle">
                @for (booking of bookings; track booking.id) {
                  <tr class="hover:bg-amber-50/30 transition-colors group">
                    <td
                      class="py-4 px-6 text-sm font-semibold text-neutral-900 group-hover:text-amber-800 transition-colors"
                    >
                      {{ booking.bookingRef }}
                    </td>
                    <td class="py-4 px-6 text-sm text-neutral-600 font-medium">
                      {{ booking.room?.type || 'Standard Room' }}
                    </td>
                    <td class="py-4 px-6 text-xs text-neutral-500">
                      <div class="flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          class="text-neutral-400"
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
                        <span>{{ booking.checkIn | date: 'MMM d' }}</span>
                        <span class="text-neutral-300">→</span>
                        <span>{{ booking.checkOut | date: 'MMM d, yyyy' }}</span>
                      </div>
                    </td>
                    <td class="py-4 px-6">
                      <span
                        class="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-100 text-[10px] font-bold uppercase tracking-wider rounded-full"
                        [class.bg-emerald-50]="
                          booking.status === 'CONFIRMED' || booking.status === 'checked_in'
                        "
                        [class.text-emerald-700]="
                          booking.status === 'CONFIRMED' || booking.status === 'checked_in'
                        "
                        [class.bg-amber-50]="booking.status === 'PENDING'"
                        [class.text-amber-700]="booking.status === 'PENDING'"
                        [class.bg-neutral-100]="
                          booking.status === 'checked_out' || booking.status === 'cancelled'
                        "
                        [class.text-neutral-600]="
                          booking.status === 'checked_out' || booking.status === 'cancelled'
                        "
                      >
                        <span
                          class="w-1.5 h-1.5 rounded-full"
                          [class.bg-emerald-500]="
                            booking.status === 'CONFIRMED' || booking.status === 'checked_in'
                          "
                          [class.bg-amber-500]="booking.status === 'PENDING'"
                          [class.bg-neutral-400]="
                            booking.status === 'checked_out' || booking.status === 'cancelled'
                          "
                        ></span>
                        {{ booking.status }}
                      </span>
                    </td>
                    <td class="py-4 px-6 text-sm font-bold text-neutral-900">
                      {{ booking.totalAmount | currency: 'INR' : 'symbol' : '1.0-0' }}
                    </td>
                    <td class="py-4 px-6 text-right">
                      <a
                        [routerLink]="['/guest/bookings', booking.id]"
                        class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white border border-black/10 text-neutral-600 hover:text-amber-700 hover:bg-amber-50 hover:border-amber-200 transition-colors shadow-sm"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <path d="M5 12h14"></path>
                          <path d="m12 5 7 7-7 7"></path>
                        </svg>
                      </a>
                    </td>
                  </tr>
                } @empty {
                  <tr>
                    <td colspan="6" class="py-16 text-center">
                      <div class="flex flex-col items-center justify-center text-neutral-400">
                        <div
                          class="w-16 h-16 rounded-full bg-neutral-50 flex items-center justify-center mb-4 border border-black/5"
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
                        <p class="text-neutral-900 font-bold mb-1">No reservations found</p>
                        <p class="text-sm text-neutral-500 mb-6">
                          You don't have any bookings matching this criteria.
                        </p>
                        <a
                          routerLink="/rooms"
                          class="button py-2.5 px-6 text-sm bg-amber-800 hover:bg-amber-900 text-white rounded-xl shadow-lg border-0 shadow-amber-900/20"
                          >Browse rooms</a
                        >
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }
    </div>
  `,
})
export class GuestBookingsPageComponent {
  private readonly bookingService = inject(BookingService);
  readonly bookings$ = this.bookingService.listMyBookings();
}
