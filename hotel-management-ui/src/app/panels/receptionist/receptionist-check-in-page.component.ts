import { AsyncPipe, CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { BehaviorSubject, firstValueFrom, map, switchMap } from 'rxjs';

import { BookingService } from '../../core/services/booking.service';

@Component({
  selector: 'app-receptionist-check-in-page',
  imports: [AsyncPipe, CurrencyPipe, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="animate-fade-in relative z-10 max-w-6xl mx-auto pb-12">
      <section class="mb-8 lg:mb-12 text-center">
        <p class="text-sm font-bold text-blue-700 uppercase tracking-widest mb-3 flex items-center justify-center gap-2">
          <span class="w-2 h-2 rounded-full bg-blue-500"></span>
          Arrivals Desk
        </p>
        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900 mb-4">
          Today's Check-ins
        </h1>
        <p class="text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed">
          Manage upcoming arrivals, verify guest details, and process manual check-ins.
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
        <div class="absolute -top-32 -right-32 w-64 h-64 bg-blue-500/10 blur-[40px] rounded-full pointer-events-none"></div>

        <div class="overflow-x-auto relative z-10 w-full">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-black/5 text-xs text-neutral-500 uppercase tracking-wider">
                <th class="p-3 lg:p-4 font-semibold">Ref / Guest</th>
                <th class="p-3 lg:p-4 font-semibold">Room details</th>
                <th class="p-3 lg:p-4 font-semibold">Dates</th>
                <th class="p-3 lg:p-4 font-semibold">Payment</th>
                <th class="p-3 lg:p-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-black/5">
              @for (booking of bookings$ | async; track booking.id) {
                <tr class="hover:bg-neutral-50/50 transition-colors group">
                  <td class="p-3 lg:p-4 align-top">
                    <p class="font-bold text-neutral-900 group-hover:text-blue-700 transition-colors">
                      {{ booking.guest?.name || 'Unknown Guest' }}
                    </p>
                    <p class="text-xs text-neutral-500 mt-1 uppercase">{{ booking.bookingRef }}</p>
                    <span class="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-neutral-100 text-neutral-600">
                      {{ booking.guests }} Guest(s)
                    </span>
                  </td>
                  <td class="p-3 lg:p-4 align-top">
                    <p class="font-medium text-neutral-800">
                      Room {{ booking.room?.roomNumber || 'TBA' }}
                    </p>
                    <p class="text-xs text-neutral-500 mt-1 capitalize">{{ booking.room?.type || 'Standard' }}</p>
                  </td>
                  <td class="p-3 lg:p-4 align-top text-sm">
                    <p class="text-neutral-800">
                      <span class="font-semibold text-neutral-500 mr-2 text-xs uppercase">IN</span> 
                      {{ booking.checkIn | date:'mediumDate' }}
                    </p>
                    <p class="text-neutral-800 mt-1">
                      <span class="font-semibold text-neutral-500 mr-2 text-xs uppercase">OUT</span> 
                      {{ booking.checkOut | date:'mediumDate' }}
                    </p>
                  </td>
                  <td class="p-3 lg:p-4 align-top">
                    <p class="font-bold text-neutral-800">{{ booking.totalAmount | currency:'INR':'symbol':'1.0-0' }}</p>
                    @if (booking.paymentStatus === 'paid') {
                      <span class="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                        Paid
                      </span>
                    } @else if (booking.paymentStatus === 'partial') {
                      <span class="inline-block mt-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700">
                        Partial
                      </span>
                    } @else {
                      <span class="inline-block mt-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-700">
                        Pending
                      </span>
                    }
                  </td>
                  <td class="p-3 lg:p-4 align-middle text-right">
                    <button
                      type="button"
                      class="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm transition-all hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm border border-transparent disabled:opacity-50"
                      (click)="checkIn(booking.id)"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
                      Check-in
                    </button>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="5" class="p-12 text-center text-neutral-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" class="mx-auto mb-3 opacity-50"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    <p class="text-base font-medium">No pending check-ins found.</p>
                    <p class="text-sm mt-1">All arrivals have been processed.</p>
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
export class ReceptionistCheckInPageComponent {
  private readonly bookingService = inject(BookingService);
  private readonly refresh$ = new BehaviorSubject<void>(undefined);
  
  readonly message = signal('');
  readonly error = signal('');
  
  readonly bookings$ = this.refresh$.pipe(
    switchMap(() => this.bookingService.listBookings({ limit: 50 })), // fetching extra to map properly
    map((result) => result.items.filter(b => b.status === 'confirmed' || b.status === 'pending')),
  );

  async checkIn(id: string): Promise<void> {
    try {
      this.message.set('');
      this.error.set('');
      await firstValueFrom(this.bookingService.checkIn(id));
      this.message.set('Guest checked in successfully.');
      this.refresh$.next();
    } catch {
      this.error.set('Unable to complete check-in. Note: Check-in fails if it is before the check-in date or if booking is already checked in.');
    }
  }
}
