import { AsyncPipe, CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { BehaviorSubject, firstValueFrom, map, switchMap } from 'rxjs';

import { BookingService } from '../../core/services/booking.service';
import { BillingService } from '../../core/services/billing.service';

@Component({
  selector: 'app-receptionist-check-out-page',
  imports: [AsyncPipe, CurrencyPipe, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="animate-fade-in relative z-10 max-w-400 mx-auto">
      <section class="mb-8 lg:mb-12">
        <p
          class="text-sm font-bold text-rose-700 uppercase tracking-widest mb-3 flex items-center gap-2"
        >
          <span class="w-2 h-2 rounded-full bg-rose-500"></span>
          Departures Desk
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
          <div>
            <p class="text-xs font-medium text-emerald-800 m-0">{{ message() }}</p>
          </div>
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
          <div class="min-w-0">
            <p class="text-xs font-medium text-red-800 m-0">{{ error() }}</p>
          </div>
        </div>
      }

      <div
        class="surface bg-white/80 backdrop-blur-xl rounded-[2rem] border border-black/5 shadow-sm overflow-hidden h-full flex flex-col"
      >
        <div class="p-6 border-b border-black/5 bg-neutral-50/50 flex items-center gap-4">
          <div
            class="w-10 h-10 rounded-xl bg-white text-rose-700 flex items-center justify-center border border-black/5 shadow-sm"
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
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </div>
          <h2 class="text-lg font-bold text-neutral-900 m-0">Check-out Records</h2>
        </div>

        <div class="overflow-x-auto flex-1 p-2">
          <table class="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr>
                <th class="py-4 px-6 font-bold text-xs uppercase tracking-widest text-neutral-500">
                  Ref / Guest
                </th>
                <th class="py-4 px-6 font-bold text-xs uppercase tracking-widest text-neutral-500">
                  Room
                </th>
                <th class="py-4 px-6 font-bold text-xs uppercase tracking-widest text-neutral-500">
                  Stays Till
                </th>
                <th class="py-4 px-6 font-bold text-xs uppercase tracking-widest text-neutral-500">
                  Payment Status
                </th>
                <th
                  class="py-4 px-6 font-bold text-xs uppercase tracking-widest text-neutral-500 text-right"
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-black/5 align-middle">
              @for (booking of bookings$ | async; track booking.id) {
                <tr class="hover:bg-rose-50/30 transition-colors group">
                  <td class="py-4 px-6">
                    <strong class="block text-sm font-bold text-neutral-900 mb-0.5">
                      {{ booking.bookingRef }}
                    </strong>
                    <span class="text-xs text-neutral-500 truncate max-w-[150px] inline-block">
                      {{ booking.guest?.name || 'Unknown Guest' }}
                    </span>
                  </td>
                  <td class="py-4 px-6 text-sm text-neutral-600 font-medium">
                    Room {{ booking.room?.roomNumber || 'TBA' }} -
                    {{ booking.room?.type || 'Standard' }}
                  </td>
                  <td class="py-4 px-6 text-sm text-neutral-600">
                    {{ booking.checkOut | date: 'short' }}
                    @if (booking.specialRequests) {
                      <p
                        class="mt-1 inline-flex items-center px-2 py-0.5 rounded-full bg-amber-100 text-[10px] font-bold uppercase tracking-wider text-amber-700"
                      >
                        Has Requests
                      </p>
                    }
                  </td>
                  <td class="py-4 px-6 text-sm text-neutral-600">
                    <p class="font-bold text-neutral-800">
                      {{ booking.totalAmount | currency: 'INR' : 'symbol' : '1.0-0' }}
                    </p>
                    @if (booking.paymentStatus === 'paid') {
                      <span
                        class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-100 text-[10px] font-bold uppercase tracking-wider rounded-full text-emerald-700 border border-emerald-200"
                      >
                        Paid
                      </span>
                    } @else {
                      <span
                        class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-rose-100 text-[10px] font-bold uppercase tracking-wider rounded-full text-rose-700 border border-rose-200"
                      >
                        Balance Owed
                      </span>
                      <p class="text-[10px] text-neutral-500 mt-1">Please use Billing Desk.</p>
                    }
                  </td>
                  <td class="py-4 px-6 text-right">
                    <button
                      type="button"
                      [disabled]="booking.paymentStatus !== 'paid'"
                      class="inline-flex items-center justify-center gap-2 px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-xl font-semibold text-sm transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      (click)="checkOut(booking.id)"
                      [title]="
                        booking.paymentStatus !== 'paid'
                          ? 'Cannot checkout with pending payment.'
                          : ''
                      "
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
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                      </svg>
                      Check-out
                    </button>
                    @if (booking.paymentStatus !== 'paid') {
                      <div class="mt-2 text-xs text-rose-500 font-medium">Clear dues first</div>
                    }
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="5" class="py-16 text-center text-neutral-500">
                    No checked-in guests found.
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
})
export class ReceptionistCheckOutPageComponent {
  private readonly bookingService = inject(BookingService);
  private readonly billingService = inject(BillingService);
  private readonly refresh$ = new BehaviorSubject<void>(undefined);

  readonly message = signal('');
  readonly error = signal('');

  readonly bookings$ = this.refresh$.pipe(
    switchMap(() => this.bookingService.listBookings({ limit: 100 })), // fetching currently checked-in
    map((result) => result.items.filter((b) => b.status === 'checked_in')),
  );

  async checkOut(id: string): Promise<void> {
    try {
      this.message.set('');
      this.error.set('');
      await firstValueFrom(this.bookingService.checkOut(id));
      this.message.set('Guest checked out successfully.');
      this.refresh$.next();
    } catch {
      this.error.set('Unable to complete check-out. Ensure all balances are settled.');
    }
  }
}
