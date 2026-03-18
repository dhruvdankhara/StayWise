import { AsyncPipe, CurrencyPipe, isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, PLATFORM_ID, inject, signal } from '@angular/core';
import { combineLatest, firstValueFrom, map } from 'rxjs';

import { ReportService } from '../../core/services/report.service';

@Component({
  selector: 'app-admin-reports-page',
  imports: [AsyncPipe, CurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (vm$ | async; as vm) {
      <div class="animate-fade-in relative z-10 max-w-400 mx-auto">
        <section class="mb-8 lg:mb-12">
          <p
            class="text-sm font-bold text-amber-700 uppercase tracking-widest mb-3 flex items-center gap-2"
          >
            <span class="w-2 h-2 rounded-full bg-amber-500"></span>
            Reports and Analysis
          </p>
          <h1
            class="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900 mb-4"
          >
            Operational Intelligence
          </h1>
          <p class="text-lg text-neutral-600 max-w-2xl leading-relaxed">
            Analyze bookings, revenue, housekeeping performance, and guest behavior from one
            dashboard.
          </p>
        </section>

        @if (message()) {
          <div
            class="mb-6 p-3 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center gap-3 animate-fade-in"
          >
            <div
              class="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0"
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
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <p class="text-xs font-medium text-emerald-800 m-0">{{ message() }}</p>
          </div>
        }

        @if (error()) {
          <div
            class="mb-6 p-3 rounded-xl bg-red-50 border border-red-100 flex items-center gap-3 animate-fade-in"
          >
            <div
              class="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0"
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
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <p class="text-xs font-medium text-red-800 m-0">{{ error() }}</p>
          </div>
        }

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <article class="surface bg-white/80 border border-black/5 rounded-3xl p-5 shadow-sm">
            <p class="text-xs uppercase tracking-widest font-bold text-neutral-500 mb-2">Revenue</p>
            <p class="text-2xl font-bold text-neutral-900 m-0">
              {{ vm.summary.bookings.totalRevenue | currency: 'INR' : 'symbol' : '1.0-0' }}
            </p>
            <p class="text-xs text-neutral-500 mt-1 mb-0">Total booking revenue</p>
          </article>
          <article class="surface bg-white/80 border border-black/5 rounded-3xl p-5 shadow-sm">
            <p class="text-xs uppercase tracking-widest font-bold text-neutral-500 mb-2">
              Occupancy
            </p>
            <p class="text-2xl font-bold text-neutral-900 m-0">
              {{ vm.summary.rooms.occupiedRooms }}/{{ vm.summary.rooms.totalRooms }}
            </p>
            <p class="text-xs text-neutral-500 mt-1 mb-0">Rooms currently occupied</p>
          </article>
          <article class="surface bg-white/80 border border-black/5 rounded-3xl p-5 shadow-sm">
            <p class="text-xs uppercase tracking-widest font-bold text-neutral-500 mb-2">
              Housekeeping
            </p>
            <p class="text-2xl font-bold text-neutral-900 m-0">
              {{ vm.summary.housekeeping.completedTasks }}/{{ vm.summary.housekeeping.totalTasks }}
            </p>
            <p class="text-xs text-neutral-500 mt-1 mb-0">Tasks completed</p>
          </article>
          <article class="surface bg-white/80 border border-black/5 rounded-3xl p-5 shadow-sm">
            <p class="text-xs uppercase tracking-widest font-bold text-neutral-500 mb-2">
              Repeat Guests
            </p>
            <p class="text-2xl font-bold text-neutral-900 m-0">
              {{ vm.summary.guests.repeatGuests }}
            </p>
            <p class="text-xs text-neutral-500 mt-1 mb-0">Guests with multiple stays</p>
          </article>
        </div>

        <div
          class="surface bg-white/80 backdrop-blur-xl rounded-4xl border border-black/5 shadow-sm overflow-hidden h-full flex flex-col"
        >
          <div
            class="p-6 border-b border-black/5 bg-neutral-50/50 flex items-center justify-between gap-4"
          >
            <h2 class="text-lg font-bold text-neutral-900 m-0">Report Snapshots</h2>
            <div class="flex items-center gap-2">
              <button
                type="button"
                class="px-3 py-1.5 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
                (click)="download('occupancy', 'xlsx')"
              >
                Occupancy XLSX
              </button>
              <button
                type="button"
                class="px-3 py-1.5 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
                (click)="download('revenue', 'pdf')"
              >
                Revenue PDF
              </button>
            </div>
          </div>

          <div class="grid grid-cols-1 xl:grid-cols-2 gap-6 p-6">
            <article class="border border-black/5 rounded-2xl overflow-hidden">
              <div class="px-4 py-3 bg-neutral-50 border-b border-black/5">
                <h3 class="text-sm font-bold text-neutral-900 m-0">Occupancy By Status</h3>
              </div>
              <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse min-w-125">
                  <thead>
                    <tr>
                      <th class="py-3 px-4 text-xs uppercase tracking-wider text-neutral-500">
                        Status
                      </th>
                      <th class="py-3 px-4 text-xs uppercase tracking-wider text-neutral-500">
                        Total
                      </th>
                      <th class="py-3 px-4 text-xs uppercase tracking-wider text-neutral-500">
                        Revenue
                      </th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-black/5">
                    @for (row of vm.occupancy; track row['status']) {
                      <tr>
                        <td class="py-3 px-4 text-sm text-neutral-700">{{ row['status'] }}</td>
                        <td class="py-3 px-4 text-sm text-neutral-700">{{ row['total'] }}</td>
                        <td class="py-3 px-4 text-sm text-neutral-700">
                          {{ asNumber(row['revenue']) | currency: 'INR' : 'symbol' : '1.0-0' }}
                        </td>
                      </tr>
                    } @empty {
                      <tr>
                        <td colspan="3" class="py-8 text-center text-neutral-500">No data.</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </article>

            <article class="border border-black/5 rounded-2xl overflow-hidden">
              <div class="px-4 py-3 bg-neutral-50 border-b border-black/5">
                <h3 class="text-sm font-bold text-neutral-900 m-0">Revenue By Room Type</h3>
              </div>
              <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse min-w-125">
                  <thead>
                    <tr>
                      <th class="py-3 px-4 text-xs uppercase tracking-wider text-neutral-500">
                        Room Type
                      </th>
                      <th class="py-3 px-4 text-xs uppercase tracking-wider text-neutral-500">
                        Bookings
                      </th>
                      <th class="py-3 px-4 text-xs uppercase tracking-wider text-neutral-500">
                        Revenue
                      </th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-black/5">
                    @for (row of vm.revenue; track row['roomType']) {
                      <tr>
                        <td class="py-3 px-4 text-sm text-neutral-700">{{ row['roomType'] }}</td>
                        <td class="py-3 px-4 text-sm text-neutral-700">{{ row['bookings'] }}</td>
                        <td class="py-3 px-4 text-sm text-neutral-700">
                          {{ asNumber(row['revenue']) | currency: 'INR' : 'symbol' : '1.0-0' }}
                        </td>
                      </tr>
                    } @empty {
                      <tr>
                        <td colspan="3" class="py-8 text-center text-neutral-500">No data.</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </article>

            <article class="border border-black/5 rounded-2xl overflow-hidden">
              <div class="px-4 py-3 bg-neutral-50 border-b border-black/5">
                <h3 class="text-sm font-bold text-neutral-900 m-0">Staff Productivity</h3>
              </div>
              <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse min-w-125">
                  <thead>
                    <tr>
                      <th class="py-3 px-4 text-xs uppercase tracking-wider text-neutral-500">
                        Staff
                      </th>
                      <th class="py-3 px-4 text-xs uppercase tracking-wider text-neutral-500">
                        Completed
                      </th>
                      <th class="py-3 px-4 text-xs uppercase tracking-wider text-neutral-500">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-black/5">
                    @for (row of vm.staff; track row['staffName']) {
                      <tr>
                        <td class="py-3 px-4 text-sm text-neutral-700">{{ row['staffName'] }}</td>
                        <td class="py-3 px-4 text-sm text-neutral-700">{{ row['completed'] }}</td>
                        <td class="py-3 px-4 text-sm text-neutral-700">{{ row['total'] }}</td>
                      </tr>
                    } @empty {
                      <tr>
                        <td colspan="3" class="py-8 text-center text-neutral-500">No data.</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </article>

            <article class="border border-black/5 rounded-2xl overflow-hidden">
              <div class="px-4 py-3 bg-neutral-50 border-b border-black/5">
                <h3 class="text-sm font-bold text-neutral-900 m-0">Top Guests</h3>
              </div>
              <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse min-w-125">
                  <thead>
                    <tr>
                      <th class="py-3 px-4 text-xs uppercase tracking-wider text-neutral-500">
                        Guest
                      </th>
                      <th class="py-3 px-4 text-xs uppercase tracking-wider text-neutral-500">
                        Email
                      </th>
                      <th class="py-3 px-4 text-xs uppercase tracking-wider text-neutral-500">
                        Stays
                      </th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-black/5">
                    @for (row of vm.guests.slice(0, 8); track row['email']) {
                      <tr>
                        <td class="py-3 px-4 text-sm text-neutral-700">{{ row['guestName'] }}</td>
                        <td class="py-3 px-4 text-sm text-neutral-700">{{ row['email'] }}</td>
                        <td class="py-3 px-4 text-sm text-neutral-700">{{ row['stays'] }}</td>
                      </tr>
                    } @empty {
                      <tr>
                        <td colspan="3" class="py-8 text-center text-neutral-500">No data.</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </article>
          </div>
        </div>
      </div>
    }
  `,
})
export class AdminReportsPageComponent {
  private readonly reportService = inject(ReportService);
  private readonly platformId = inject(PLATFORM_ID);

  readonly message = signal('');
  readonly error = signal('');

  readonly vm$ = combineLatest({
    summary: this.reportService.analyticsSummary(),
    occupancy: this.reportService.occupancyReport(),
    revenue: this.reportService.revenueReport(),
    staff: this.reportService.staffReport(),
    guests: this.reportService.guestReport(),
  }).pipe(map((result) => result));

  async download(
    key: 'occupancy' | 'revenue' | 'staff' | 'guests',
    format: 'pdf' | 'xlsx',
  ): Promise<void> {
    this.message.set('');
    this.error.set('');

    try {
      const blob = await firstValueFrom(
        this.reportService.downloadReport(`/reports/${key}`, format),
      );

      if (!isPlatformBrowser(this.platformId)) {
        this.message.set('Download prepared. Open this in browser mode to save the file.');
        return;
      }

      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `${key}-report.${format}`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
      this.message.set('Report download started.');
    } catch {
      this.error.set('Unable to download report.');
    }
  }

  asNumber(value: unknown): number {
    if (typeof value === 'number') {
      return value;
    }

    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
}
