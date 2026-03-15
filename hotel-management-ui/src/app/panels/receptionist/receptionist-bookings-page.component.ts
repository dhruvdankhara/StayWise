import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, firstValueFrom, map, switchMap } from 'rxjs';

import { BookingService } from '../../core/services/booking.service';

@Component({
  selector: 'app-receptionist-bookings-page',
  imports: [AsyncPipe, CurrencyPipe, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="animate-fade-in relative z-10 max-w-[1600px] mx-auto">
      <section class="mb-8 lg:mb-12">
        <p
          class="text-sm font-bold text-amber-700 uppercase tracking-widest mb-3 flex items-center gap-2"
        >
          <span class="w-2 h-2 rounded-full bg-amber-500"></span>
          {{ title().eyebrow }}
        </p>
        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900 mb-4">
          {{ title().title }}
        </h1>
        <p class="text-lg text-neutral-600 max-w-2xl leading-relaxed">
          {{ title().description }}
        </p>
      </section>

      <div class="grid grid-cols-1 gap-8 ">
        <!-- Form Side -->
        <div class="lg:col-span-4 xl:col-span-3 lg:sticky lg:top-8">
          <form
            class="surface bg-white/80 backdrop-blur-xl rounded-[2rem] border border-black/5 shadow-sm p-6 sm:p-8 relative overflow-hidden"
            [formGroup]="form"
            (ngSubmit)="save()"
          >
            <div
              class="absolute -top-32 -left-32 w-64 h-64 bg-amber-500/10 blur-[40px] rounded-full pointer-events-none"
            ></div>

            <div class="flex items-center gap-3 mb-8 relative z-10">
              <div
                class="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-900/10"
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
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </div>
              <h2 class="text-xl font-bold text-neutral-900 m-0">
                {{ editingId() ? 'Edit booking' : 'Create booking' }}
              </h2>
            </div>

            <div class="flex flex-col gap-5 relative z-10">
              <label class="flex flex-col gap-1.5">
                <span class="text-xs font-semibold text-neutral-700 uppercase tracking-wide"
                  >Guest ID</span
                >
                <input
                  type="text"
                  formControlName="guestId"
                  class="w-full px-4 py-2.5 bg-neutral-50 border border-black/5 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-sm outline-none"
                />
              </label>

              <label class="flex flex-col gap-1.5">
                <span class="text-xs font-semibold text-neutral-700 uppercase tracking-wide"
                  >Room ID</span
                >
                <input
                  type="text"
                  formControlName="roomId"
                  class="w-full px-4 py-2.5 bg-neutral-50 border border-black/5 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-sm outline-none"
                />
              </label>

              <div class="grid grid-cols-2 gap-4">
                <label class="flex flex-col gap-1.5">
                  <span class="text-xs font-semibold text-neutral-700 uppercase tracking-wide"
                    >Check-in</span
                  >
                  <input
                    type="datetime-local"
                    formControlName="checkIn"
                    class="w-full px-3 py-2.5 bg-neutral-50 border border-black/5 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-[13px] outline-none"
                  />
                </label>

                <label class="flex flex-col gap-1.5">
                  <span class="text-xs font-semibold text-neutral-700 uppercase tracking-wide"
                    >Check-out</span
                  >
                  <input
                    type="datetime-local"
                    formControlName="checkOut"
                    class="w-full px-3 py-2.5 bg-neutral-50 border border-black/5 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-[13px] outline-none"
                  />
                </label>
              </div>

              <label class="flex flex-col gap-1.5">
                <span class="text-xs font-semibold text-neutral-700 uppercase tracking-wide"
                  >Guests Number</span
                >
                <input
                  type="number"
                  min="1"
                  formControlName="guests"
                  class="w-full px-4 py-2.5 bg-neutral-50 border border-black/5 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-sm outline-none"
                />
              </label>

              <label class="flex flex-col gap-1.5">
                <span class="text-xs font-semibold text-neutral-700 uppercase tracking-wide"
                  >Special Requests</span
                >
                <textarea
                  formControlName="specialRequests"
                  rows="2"
                  class="w-full px-4 py-2.5 bg-neutral-50 border border-black/5 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-sm outline-none resize-none"
                ></textarea>
              </label>
            </div>

            @if (message()) {
              <div
                class="mt-6 p-3 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center gap-3 animate-fade-in relative z-10"
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
                class="mt-6 p-3 rounded-xl bg-red-50 border border-red-100 flex items-center gap-3 animate-fade-in relative z-10"
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

            <div class="mt-8 pt-6 border-t border-black/5 flex flex-col gap-3 relative z-10">
              <button
                type="submit"
                class="button w-full justify-center py-2.5 text-sm bg-amber-800 hover:bg-amber-900 border-0 shadow-lg shadow-amber-900/20 text-white rounded-xl transition-transform hover:-translate-y-0.5"
              >
                {{ editingId() ? 'Save changes' : 'Create booking' }}
              </button>
              @if (editingId()) {
                <button
                  type="button"
                  class="w-full py-2.5 text-sm font-semibold text-neutral-600 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-colors"
                  (click)="reset()"
                >
                  Cancel Edit
                </button>
              }
            </div>
          </form>
        </div>

        <!-- Table Side -->
        <div class="lg:col-span-8 xl:col-span-9">
          <div
            class="surface bg-white/80 backdrop-blur-xl rounded-[2rem] border border-black/5 shadow-sm overflow-hidden h-full flex flex-col"
          >
            <div class="p-6 border-b border-black/5 bg-neutral-50/50 flex items-center gap-4">
              <div
                class="w-10 h-10 rounded-xl bg-white text-neutral-600 flex items-center justify-center border border-black/5 shadow-sm"
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
                  <line x1="8" y1="6" x2="21" y2="6"></line>
                  <line x1="8" y1="12" x2="21" y2="12"></line>
                  <line x1="8" y1="18" x2="21" y2="18"></line>
                  <line x1="3" y1="6" x2="3.01" y2="6"></line>
                  <line x1="3" y1="12" x2="3.01" y2="12"></line>
                  <line x1="3" y1="18" x2="3.01" y2="18"></line>
                </svg>
              </div>
              <h2 class="text-lg font-bold text-neutral-900 m-0">Booking Records</h2>
            </div>

            <div class="overflow-x-auto flex-1 p-2">
              @if (bookings$ | async; as bookings) {
                <table class="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr>
                      <th
                        class="py-4 px-6 font-bold text-xs uppercase tracking-widest text-neutral-500"
                      >
                        Ref / Guest
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
                        class="py-4 px-6 font-bold text-xs uppercase tracking-widest text-neutral-500"
                      >
                        Total
                      </th>
                      <th
                        class="py-4 px-6 font-bold text-xs uppercase tracking-widest text-neutral-500 text-right"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-black/5 align-middle">
                    @for (booking of bookings; track booking.id) {
                      <tr class="hover:bg-amber-50/30 transition-colors group">
                        <td class="py-4 px-6">
                          <strong class="block text-sm font-bold text-neutral-900 mb-0.5">{{
                            booking.bookingRef
                          }}</strong>
                          <span
                            class="text-xs text-neutral-500 truncate max-w-[150px] inline-block"
                            >{{ booking.guest?.name || booking.guest?.id || 'Guest' }}</span
                          >
                        </td>
                        <td class="py-4 px-6 text-sm text-neutral-600 font-medium">
                          {{ booking.room?.type || booking.room?.id || 'Room' }}
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
                        <td class="py-4 px-6 text-sm font-bold text-neutral-900">
                          {{ booking.totalAmount | currency: 'INR' : 'symbol' : '1.0-0' }}
                        </td>
                        <td class="py-4 px-6">
                          <div class="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              class="w-8 h-8 rounded-full bg-white hover:bg-neutral-100 border border-black/10 flex items-center justify-center text-neutral-600 transition-colors"
                              (click)="edit(booking.id)"
                              title="Edit Booking"
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
                                <path
                                  d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                                ></path>
                                <path
                                  d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                                ></path>
                              </svg>
                            </button>
                            <button
                              type="button"
                              class="w-8 h-8 rounded-full bg-white hover:bg-red-50 border border-black/10 flex items-center justify-center text-red-600 hover:text-red-700 hover:border-red-200 transition-colors"
                              (click)="cancel(booking.id)"
                              title="Cancel Booking"
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
                                <line x1="15" y1="9" x2="9" y2="15"></line>
                                <line x1="9" y1="9" x2="15" y2="15"></line>
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    } @empty {
                      <tr>
                        <td colspan="5" class="py-16 text-center text-neutral-500">
                          No bookings found in this workspace.
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ReceptionistBookingsPageComponent {
  private readonly bookingService = inject(BookingService);
  private readonly route = inject(ActivatedRoute);
  private readonly formBuilder = inject(FormBuilder);
  private readonly refresh$ = new BehaviorSubject<void>(undefined);

  readonly message = signal('');
  readonly error = signal('');
  readonly editingId = signal<string | null>(null);
  readonly form = this.formBuilder.nonNullable.group({
    guestId: ['', Validators.required],
    roomId: ['', Validators.required],
    checkIn: ['', Validators.required],
    checkOut: ['', Validators.required],
    guests: [1, [Validators.required, Validators.min(1)]],
    specialRequests: [''],
  });

  readonly title = signal(
    this.route.snapshot.data as { eyebrow: string; title: string; description: string },
  );
  readonly bookings$ = this.refresh$.pipe(
    switchMap(() => this.bookingService.listBookings()),
    map((result) => result.items),
  );

  async save(): Promise<void> {
    this.error.set('');
    this.message.set('');

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = {
      ...this.form.getRawValue(),
      checkIn: new Date(this.form.getRawValue().checkIn).toISOString(),
      checkOut: new Date(this.form.getRawValue().checkOut).toISOString(),
    };

    try {
      if (this.editingId()) {
        await firstValueFrom(this.bookingService.updateBooking(this.editingId()!, payload));
        this.message.set('Booking updated successfully.');
      } else {
        await firstValueFrom(this.bookingService.createBooking(payload));
        this.message.set('Booking created successfully.');
      }
      this.reset();
      this.refresh$.next();
    } catch {
      this.error.set('Unable to save the booking.');
    }
  }

  async edit(id: string): Promise<void> {
    this.error.set('');
    const booking = await firstValueFrom(this.bookingService.getBooking(id));
    this.editingId.set(id);
    this.form.setValue({
      guestId: booking.guest?.id ?? '',
      roomId: booking.room?.id ?? '',
      checkIn: booking.checkIn.slice(0, 16),
      checkOut: booking.checkOut.slice(0, 16),
      guests: booking.guests,
      specialRequests: booking.specialRequests ?? '',
    });
  }

  async cancel(id: string): Promise<void> {
    try {
      await firstValueFrom(
        this.bookingService.cancelBooking(id, 'Cancelled from bookings workspace'),
      );
      this.message.set('Booking cancelled.');
      this.refresh$.next();
    } catch {
      this.error.set('Unable to cancel the booking.');
    }
  }

  reset(): void {
    this.editingId.set(null);
    this.form.reset({
      guestId: '',
      roomId: '',
      checkIn: '',
      checkOut: '',
      guests: 1,
      specialRequests: '',
    });
  }
}
