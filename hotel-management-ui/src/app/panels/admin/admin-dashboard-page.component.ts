import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, map } from 'rxjs';

import { BookingService } from '../../core/services/booking.service';
import { HousekeepingService } from '../../core/services/housekeeping.service';
import { RoomService } from '../../core/services/room.service';
import { MetricCardComponent } from '../../shared/components/metric-card.component';

@Component({
  selector: 'app-admin-dashboard-page',
  imports: [AsyncPipe, CurrencyPipe, MetricCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (vm$ | async; as vm) {
      <div class="animate-fade-in relative z-10 max-w-[1600px] mx-auto">
        <!-- Page Header -->
        <section class="mb-10 lg:mb-14">
          <p
            class="text-sm font-bold text-amber-700 uppercase tracking-widest mb-3 flex items-center gap-2"
          >
            <span class="w-2 h-2 rounded-full bg-amber-500"></span>
            {{ vm.eyebrow }}
          </p>
          <h1
            class="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900 mb-4"
          >
            {{ vm.title }}
          </h1>
          <p class="text-lg text-neutral-600 max-w-2xl leading-relaxed">
            {{ vm.description }}
          </p>
        </section>

        <!-- Metrics Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
          @for (metric of vm.metrics; track metric.label) {
            <app-metric-card [label]="metric.label" [value]="metric.value" [change]="metric.hint" />
          }
        </div>

        <!-- 2 Column Layout for Widgets -->
        <div class="grid grid-cols-1 gap-8 lg:gap-12">
          <!-- Recent Bookings Widget -->
          <article
            class="surface bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-black/5 shadow-sm overflow-hidden flex flex-col h-full"
          >
            <div class="p-8 border-b border-black/5 flex items-center gap-4 bg-neutral-50/50">
              <div
                class="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-900/10"
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
                  <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
                </svg>
              </div>
              <h2 class="text-xl font-bold text-neutral-900 m-0">Recent Bookings</h2>
            </div>

            <div class="overflow-x-auto flex-1 p-2">
              <table class="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr>
                    <th
                      class="py-4 px-6 font-bold text-xs uppercase tracking-widest text-neutral-500"
                    >
                      Ref
                    </th>
                    <th
                      class="py-4 px-6 font-bold text-xs uppercase tracking-widest text-neutral-500"
                    >
                      Room
                    </th>
                    <th
                      class="py-4 px-6 font-bold text-xs uppercase tracking-widest text-neutral-500"
                    >
                      Status
                    </th>
                    <th
                      class="py-4 px-6 font-bold text-xs uppercase tracking-widest text-neutral-500 text-right"
                    >
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-black/5 align-middle">
                  @for (booking of vm.bookings.slice(0, 5); track booking.id) {
                    <tr class="hover:bg-neutral-50/50 transition-colors">
                      <td class="py-4 px-6 text-sm font-semibold text-neutral-900">
                        {{ booking.bookingRef }}
                      </td>
                      <td class="py-4 px-6 text-sm text-neutral-600 font-medium">
                        {{ booking.room?.type || 'Room' }}
                      </td>
                      <td class="py-4 px-6">
                        <span
                          class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-100 text-[10px] font-bold uppercase tracking-wider rounded-full text-neutral-600 border border-black/5"
                        >
                          <span
                            class="w-1.5 h-1.5 rounded-full"
                            [class.bg-amber-500]="booking.status === 'PENDING'"
                            [class.bg-emerald-500]="
                              booking.status === 'CONFIRMED' || booking.status === 'checked_in'
                            "
                            [class.bg-neutral-400]="
                              booking.status === 'checked_out' || booking.status === 'cancelled'
                            "
                          ></span>
                          {{ booking.status }}
                        </span>
                      </td>
                      <td class="py-4 px-6 text-sm font-bold text-neutral-900 text-right">
                        {{ booking.totalAmount | currency: 'INR' : 'symbol' : '1.0-0' }}
                      </td>
                    </tr>
                  } @empty {
                    <tr>
                      <td
                        colspan="4"
                        class="px-6 py-12 text-center text-sm text-neutral-500 font-medium border-0"
                      >
                        No recent bookings available.
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </article>

          <!-- Open Housekeeping Widget -->
          <article
            class="surface bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-black/5 shadow-sm overflow-hidden flex flex-col h-full"
          >
            <div class="p-8 border-b border-black/5 flex items-center gap-4 bg-orange-50/30">
              <div
                class="w-12 h-12 rounded-2xl bg-white text-orange-600 flex items-center justify-center border border-black/5 shadow-sm"
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
                  <path d="m2.5 13 4.5-4.5"></path>
                  <path d="m9.5 6 4.5-4.5"></path>
                  <path d="m11.5 8 4.5-4.5"></path>
                  <path d="M14.5 11 22 3.5"></path>
                  <path d="m6 16.5-4 4.5"></path>
                  <path d="m9 13.5-4 4.5"></path>
                  <path d="m12 10.5-4 4.5"></path>
                  <path d="m15 7.5-4 4.5"></path>
                  <path d="M19 19.5v-3.5a1.5 1.5 0 0 0-1.5-1.5H14a1.5 1.5 0 0 0-1.5 1.5v3.5"></path>
                  <path d="M14 17h3.5"></path>
                </svg>
              </div>
              <h2 class="text-xl font-bold text-neutral-900 m-0">Open Housekeeping</h2>
            </div>

            <div class="p-4 sm:p-6 lg:p-8 flex-1">
              <div class="flex flex-col gap-4">
                @for (task of vm.tasks.slice(0, 5); track task.id) {
                  <div
                    class="flex items-start gap-4 p-4 rounded-2xl border border-black/5 bg-white hover:border-black/10 transition-colors shadow-sm"
                  >
                    <div
                      class="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 shrink-0 font-bold text-sm"
                    >
                      {{ task.room?.roomNumber?.charAt(0) || 'R' }}
                    </div>
                    <div class="flex-1">
                      <div class="flex justify-between items-start mb-1">
                        <strong class="text-sm font-bold text-neutral-900"
                          >Room {{ task.room?.roomNumber || 'TBD' }}</strong
                        >
                        @if (task.priority === 'high' || task.priority === 'urgent') {
                          <span
                            class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-50 text-[10px] font-bold uppercase tracking-wider rounded-full text-red-700"
                          >
                            <span class="w-1.5 h-1.5 rounded-full bg-red-500"></span> High Priority
                          </span>
                        } @else {
                          <span
                            class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-100 text-[10px] font-bold uppercase tracking-wider rounded-full text-neutral-600"
                          >
                            {{ task.priority }}
                          </span>
                        }
                      </div>
                      <div class="flex items-center gap-2 mt-2">
                        <span
                          class="text-xs font-semibold text-neutral-700 px-2 py-0.5 bg-neutral-100 rounded-md uppercase tracking-wide"
                          >{{ task.status }}</span
                        >
                        <span class="text-xs text-neutral-500 truncate max-w-[200px]">{{
                          task.notes || 'No notes provided.'
                        }}</span>
                      </div>
                    </div>
                  </div>
                } @empty {
                  <div
                    class="flex flex-col items-center justify-center py-12 px-6 rounded-2xl bg-neutral-50/50 border border-dashed border-black/10 text-center"
                  >
                    <div
                      class="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3"
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
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                    </div>
                    <strong class="block text-neutral-900 font-bold mb-1">No active tasks</strong>
                    <span class="text-sm text-neutral-500"
                      >Housekeeping queue is completely clear.</span
                    >
                  </div>
                }
              </div>
            </div>
          </article>
        </div>
      </div>
    }
  `,
})
export class AdminDashboardPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly bookingService = inject(BookingService);
  private readonly roomService = inject(RoomService);
  private readonly housekeepingService = inject(HousekeepingService);

  readonly vm$ = combineLatest({
    bookings: this.bookingService.listBookings().pipe(map((result) => result.items)),
    rooms: this.roomService.listRooms({ limit: 20 }),
    tasks: this.housekeepingService.listTasks(),
  }).pipe(
    map(({ bookings, rooms, tasks }) => {
      const config = this.route.snapshot.data as {
        eyebrow: string;
        title: string;
        description: string;
      };
      return {
        ...config,
        bookings,
        tasks,
        metrics: [
          { label: 'Bookings', value: String(bookings.length), hint: 'Visible for this role' },
          { label: 'Rooms', value: String(rooms.length), hint: 'Active inventory loaded' },
          {
            label: 'Open tasks',
            value: String(tasks.filter((task) => task.status !== 'completed').length),
            hint: 'Housekeeping items not yet finished',
          },
        ],
      };
    }),
  );
}
