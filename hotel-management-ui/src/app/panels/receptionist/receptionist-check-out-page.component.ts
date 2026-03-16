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
    <div class="animate-fade-in relative z-10 max-w-6xl mx-auto pb-12">
      <section class="mb-8 lg:mb-12 text-center">
        <p class="text-sm font-bold text-rose-700 uppercase tracking-widest mb-3 flex items-center justify-center gap-2">
          <span class="w-2 h-2 rounded-full bg-rose-500"></span>
          Departures Desk
        </p>
        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900 mb-4">
          Current Stays & Check-outs
        </h1>
        <p class="text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed">
          Process guest departures and ensure all pending balances are settled before check-out.
        </p>
      </section>

      @if (message()) {
        <div class="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3 text-emerald-800 animate-in fade-in max-w-3xl mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" class="text-emerald-600 mt-0.5 shrink-0" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          <div>
            <p class="font-bold text-sm mb-1">Success</p>
            <p class="text-xs m-0">{{ message() }}</p>
          </div>
        </div>
      }

      @if (error()) {
        <div class="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-amber-800 animate-in fade-in max-w-3xl mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" class="text-amber-600 mt-0.5 shrink-0" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          <div>
            <p class="font-bold text-sm mb-1">Notice</p>
            <p class="text-xs m-0">{{ error() }}</p>
          </div>
        </div>
      }

      <div class="surface bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-black/5 shadow-sm p-4 sm:p-8 relative overflow-hidden">
        <div class="absolute -top-32 -left-32 w-64 h-64 bg-rose-500/10 blur-[40px] rounded-full pointer-events-none"></div>

        <div class="overflow-x-auto relative z-10 w-full">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-black/5 text-xs text-neutral-500 uppercase tracking-wider">
                <th class="p-3 lg:p-4 font-semibold">Ref / Guest</th>
                <th class="p-3 lg:p-4 font-semibold">Room </th>
                <th class="p-3 lg:p-4 font-semibold">Stays Till</th>
                <th class="p-3 lg:p-4 font-semibold">Payment Status</th>
                <th class="p-3 lg:p-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-black/5">
              @for (booking of bookings$ | async; track booking.id) {
                <tr class="hover:bg-neutral-50/50 transition-colors group">
                  <td class="p-3 lg:p-4 align-top">
                    <p class="font-bold text-neutral-900 group-hover:text-rose-700 transition-colors">
                      {{ booking.guest?.name || 'Unknown Guest' }}
                    </p>
                    <p class="text-xs text-neutral-500 mt-1 uppercase">{{ booking.bookingRef }}</p>
                  </td>
                  <td class="p-3 lg:p-4 align-top">
                    <p class="font-medium text-neutral-800">
                      Room {{ booking.room?.roomNumber || 'TBA' }}
                    </p>
                    <p class="text-xs text-neutral-500 mt-1 capitalize">{{ booking.room?.type || 'Standard' }}</p>
                  </td>
                  <td class="p-3 lg:p-4 align-top text-sm">
                    <p class="text-neutral-800">
                      <span class="font-semibold text-neutral-500 mr-2 text-xs uppercase">OUT</span> 
                      {{ booking.checkOut | date:'mediumDate' }}
                    </p>
                    @if (booking.specialRequests) {
                       <p class="text-[10px] uppercase font-bold text-amber-600 bg-amber-100 rounded px-1.5 py-0.5 inline-block mt-1">Has Requests</p>
                    }
                  </td>
                  <td class="p-3 lg:p-4 align-top">
                    <p class="font-bold text-neutral-800">{{ booking.totalAmount | currency:'INR':'symbol':'1.0-0' }}</p>
                    @if (booking.paymentStatus === 'paid') {
                      <span class="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                        Paid in Full
                      </span>
                    } @else {
                      <span class="inline-block mt-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-700">
                        Balance Owed
                      </span>
                      <p class="text-[10px] text-neutral-500 mt-1">Please use Billing Desk</p>
                    }
                  </td>
                  <td class="p-3 lg:p-4 align-middle text-right">
                    <button
                      type="button"
                      [disabled]="booking.paymentStatus !== 'paid'"
                      class="inline-flex items-center justify-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold text-sm transition-all hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-rose-500/50 shadow-sm border border-transparent disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:bg-rose-600"
                      (click)="checkOut(booking.id)"
                      [title]="booking.paymentStatus !== 'paid' ? 'Cannot checkout with pending payment.' : ''"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                      Check-out
                    </button>
                    @if (booking.paymentStatus !== 'paid') {
                      <div class="mt-2 text-xs text-rose-500 font-medium">Clear dues first</div>
                    }
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="5" class="p-12 text-center text-neutral-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" class="mx-auto mb-3 opacity-50"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    <p class="text-base font-medium">No checked-in guests found.</p>
                    <p class="text-sm mt-1">Waiting for arrivals.</p>
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
    map((result) => result.items.filter(b => b.status === 'checked_in')),
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
