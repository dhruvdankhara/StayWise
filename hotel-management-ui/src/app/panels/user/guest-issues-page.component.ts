import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { BookingService } from '../../core/services/booking.service';

@Component({
  selector: 'app-guest-issues-page',
  imports: [AsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="animate-fade-in relative z-10 max-w-7xl mx-auto">
      <section class="mb-10 lg:mb-14">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p
              class="text-sm font-bold text-red-700 uppercase tracking-widest mb-3 flex items-center gap-2"
            >
              <span class="w-2 h-2 rounded-full bg-red-500"></span>
              Issue Reporting
            </p>
            <h1 class="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900">
              Need assistance with a stay?
            </h1>
            <p class="text-lg text-neutral-600 mt-4 max-w-2xl">
              Current and recent stays that may need escalation. Provide your booking reference when
              contacting the front desk or support team.
            </p>
          </div>
          <a
            href="mailto:support@staywise.com"
            class="inline-flex items-center justify-center px-5 py-3 text-sm font-semibold rounded-2xl bg-red-50 border border-red-100 text-red-700 hover:bg-red-100 transition-colors shadow-sm whitespace-nowrap gap-2"
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
              <path
                d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
              ></path>
            </svg>
            Contact Support
          </a>
        </div>
      </section>

      @if (bookings$ | async; as bookings) {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (booking of bookings; track booking.id) {
            <article
              class="surface flex flex-col h-full bg-white/80 backdrop-blur-xl border border-white/60 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all rounded-[2rem] p-6 sm:p-8 relative overflow-hidden group"
            >
              <!-- Background accent hover effect -->
              <div
                class="absolute -right-8 -top-8 w-32 h-32 bg-red-500/0 group-hover:bg-red-500/5 blur-[20px] rounded-full transition-colors duration-500 pointer-events-none"
              ></div>

              <div class="flex justify-between items-start mb-6 z-10 relative">
                <div
                  class="w-12 h-12 rounded-2xl bg-neutral-100 border border-black/5 flex items-center justify-center text-neutral-600 shrink-0"
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
                    <path
                      d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
                    ></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                </div>
                <span
                  class="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-100 text-[10px] font-bold uppercase tracking-wider rounded-full text-neutral-600 border border-black/5"
                >
                  <span class="w-1.5 h-1.5 rounded-full bg-neutral-400"></span>
                  {{ booking.status }}
                </span>
              </div>

              <div class="flex-1 z-10 relative">
                <h3 class="text-xl font-bold text-neutral-900 mb-2">
                  {{ booking.room?.type || 'Room stay' }}
                </h3>
                <p class="text-sm font-semibold text-neutral-800 mb-1">
                  ID:
                  <span class="font-mono text-amber-800 select-all">{{ booking.bookingRef }}</span>
                </p>
                <p
                  class="text-xs text-neutral-500 mb-6 flex items-center gap-1.5 border-b border-black/5 pb-4"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
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
                  {{ booking.checkIn }} to {{ booking.checkOut }}
                </p>
              </div>

              <div class="rounded-2xl bg-neutral-50 border border-black/5 p-4 z-10 relative">
                <p class="text-xs font-semibold text-neutral-900 tracking-wide uppercase mb-1">
                  Escalation Step
                </p>
                <p class="text-sm text-neutral-600 leading-relaxed">
                  Provide this booking reference when contacting the primary front-desk phone number
                  or email.
                </p>
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
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-neutral-900 mb-3">No bookings found</h3>
              <p class="text-neutral-500 max-w-sm mx-auto leading-relaxed">
                You don't have any attached stays that require escalation.
              </p>
            </article>
          }
        </div>
      }
    </div>
  `,
})
export class GuestIssuesPageComponent {
  private readonly bookingService = inject(BookingService);
  readonly bookings$ = this.bookingService.listMyBookings();
}
