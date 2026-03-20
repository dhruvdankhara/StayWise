import { AsyncPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { map } from 'rxjs';

import { BookingService } from '../../core/services/booking.service';

@Component({
  selector: 'app-guest-reviews-page',
  imports: [AsyncPipe, DatePipe, RouterLink],
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
              Reviews & Feedback
            </p>
            <h1 class="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900">
              Share your experience.
            </h1>
            <p class="text-lg text-neutral-600 mt-4 max-w-2xl">
              Completed stays that are eligible for rating and written feedback. Your insights help
              us improve and guide future guests.
            </p>
          </div>
        </div>
      </section>

      @if (eligibleBookings$ | async; as bookings) {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (booking of bookings; track booking.id) {
            <article
              class="surface flex flex-col h-full bg-white/80 backdrop-blur-xl border border-white/60 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all rounded-4xl p-6 sm:p-8 relative overflow-hidden group"
            >
              <!-- Background accent hover effect -->
              <div
                class="absolute -right-8 -top-8 w-32 h-32 bg-amber-500/0 group-hover:bg-amber-500/10 blur-[20px] rounded-full transition-colors duration-500 pointer-events-none"
              ></div>

              <div class="flex justify-between items-start mb-6">
                <div
                  class="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-700 shrink-0"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                </div>
                <span
                  class="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider rounded-full"
                >
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Completed
                </span>
              </div>

              <div class="flex-1">
                <h3 class="text-xl font-bold text-neutral-900 mb-2">
                  {{ booking.room?.type || 'Room stay' }}
                </h3>
                <p class="text-sm text-neutral-500 font-medium mb-4 flex items-center gap-2">
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
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  Stayed until {{ booking.checkOut | date: 'longDate' }}
                </p>
                <p class="text-sm text-neutral-600 leading-relaxed mb-6">
                  Open the booking detail page to sumbit a star rating and a written review of your
                  stay.
                </p>
              </div>

              <div class="pt-6 border-t border-black/5 mt-auto flex items-center justify-between">
                <div class="text-xs font-mono text-neutral-400 select-all">
                  {{ booking.bookingRef }}
                </div>
                <a
                  routerLink="/guest/bookings/{{ booking.id }}"
                  class="text-sm font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                >
                  Submit Review
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
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </a>
              </div>
            </article>
          } @empty {
            <article
              class="col-span-full surface flex flex-col items-center justify-center p-16 text-center border-2 border-dashed border-neutral-200/60 rounded-[3rem] bg-neutral-50/50"
            >
              <div
                class="w-20 h-20 rounded-full bg-white flex items-center justify-center border border-black/5 shadow-sm text-neutral-400 mb-6"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="m8 9.5 1.5 1.5L12 8"></path>
                  <path d="m16 9.5-1.5 1.5L12 8"></path>
                  <path d="M12 17c-2.33 0-4-1.67-4-1.67"></path>
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-neutral-900 mb-3">No eligible stays yet</h3>
              <p class="text-neutral-500 max-w-sm mx-auto leading-relaxed">
                Reviews unlock automatically after you have checked out from your reservation.
                Complete a stay to leave feedback.
              </p>
            </article>
          }
        </div>
      }
    </div>
  `,
})
export class GuestReviewsPageComponent {
  private readonly bookingService = inject(BookingService);
  readonly eligibleBookings$ = this.bookingService
    .listMyBookings()
    .pipe(map((bookings) => bookings.filter((booking) => booking.status === 'checked_out')));
}
