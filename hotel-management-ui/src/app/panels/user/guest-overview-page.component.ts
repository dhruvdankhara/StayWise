import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { map } from 'rxjs';

import { AuthService } from '../../core/services/auth.service';
import { BookingService } from '../../core/services/booking.service';
import { MetricCardComponent } from '../../shared/components/metric-card.component';

@Component({
  selector: 'app-guest-overview-page',
  imports: [AsyncPipe, MetricCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (vm$ | async; as vm) {
      <div class="animate-fade-in relative z-10">
        <section class="max-w-7xl mx-auto">
          <!-- Page Header -->
          <div class="mb-10 lg:mb-14">
            <p
              class="text-sm font-bold text-amber-700 uppercase tracking-widest mb-3 flex items-center gap-2"
            >
              <span class="w-2 h-2 rounded-full bg-amber-500"></span>
              Guest Dashboard
            </p>
            <h1
              class="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 mb-4"
            >
              Welcome back, <span class="text-amber-800">{{ vm.userName }}</span
              >.
            </h1>
            <p class="text-lg text-neutral-600 max-w-2xl leading-relaxed">
              Self-service portal for managing bookings, retrieving invoices, updating profile
              settings, and submitting stay feedback.
            </p>
          </div>

          <!-- Metrics Grid -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <div
              class="bg-gradient-to-br from-amber-600 to-amber-900 rounded-[2rem] p-8 shadow-xl relative overflow-hidden text-white flex flex-col md:col-span-3 lg:col-span-1 border border-amber-900/20"
            >
              <div
                class="absolute -right-20 -bottom-20 w-64 h-64 bg-white/10 blur-[40px] rounded-full"
              ></div>
              <div
                class="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm shadow-sm flex items-center justify-center text-white mb-6 border border-white/20"
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
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                </svg>
              </div>
              <h2 class="text-4xl font-bold tracking-tight mb-2">{{ vm.metrics[0].value }}</h2>
              <p class="text-sm uppercase font-bold tracking-widest text-amber-100/80 mb-6">
                {{ vm.metrics[0].label }}
              </p>

              <div class="mt-auto pt-6 border-t border-white/20">
                <p class="text-xs font-medium text-white/80 leading-relaxed">
                  {{ vm.metrics[0].hint }}
                </p>
              </div>
            </div>

            @for (metric of vm.metrics.slice(1); track metric.label) {
              <div class="md:col-span-1 xl:col-span-1 h-full">
                <app-metric-card
                  [label]="metric.label"
                  [value]="metric.value"
                  [change]="metric.hint"
                />
              </div>
            }
          </div>
        </section>
      </div>
    }
  `,
})
export class GuestOverviewPageComponent {
  private readonly authService = inject(AuthService);
  private readonly bookingService = inject(BookingService);

  readonly vm$ = this.bookingService.listMyBookings().pipe(
    map((bookings) => ({
      userName: this.authService.user()?.name ?? 'Guest',
      metrics: [
        {
          label: 'Bookings',
          value: String(bookings.length),
          hint: 'All reservations attached to your account',
        },
        {
          label: 'Upcoming stays',
          value: String(
            bookings.filter((item) => item.status !== 'checked_out' && item.status !== 'cancelled')
              .length,
          ),
          hint: 'Future or active reservations',
        },
        {
          label: 'Completed stays',
          value: String(bookings.filter((item) => item.status === 'checked_out').length),
          hint: 'Eligible for review submission',
        },
      ],
    })),
  );
}
