import { AsyncPipe, CurrencyPipe, isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom, map, switchMap } from 'rxjs';

import { BillingService } from '../../core/services/billing.service';
import { BookingService } from '../../core/services/booking.service';
import { RoomService } from '../../core/services/room.service';
import { PLATFORM_ID } from '@angular/core';

interface RazorpayPaymentResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

@Component({
  selector: 'app-booking-checkout-page',
  imports: [AsyncPipe, CurrencyPipe, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="animate-fade-in pb-20 pt-8 mt-12 text-left">
      @if (room$ | async; as room) {
        <section class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 xl:grid-cols-2 gap-12 lg:gap-20 items-stretch relative z-10">
            <div class="space-y-8 z-10 pt-4">
              <div>
                <div
                  class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-950/5 border border-orange-900/10 mb-4"
                >
                  <span class="w-2 h-2 rounded-full bg-amber-600 animate-pulse"></span>
                  <p class="eyebrow m-0! text-xs! text-amber-800">Secure Checkout</p>
                </div>
                <h1
                  class="text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 leading-[1.1]"
                >
                  Confirm your <br /><span class="text-amber-700">{{ room.type }}</span>
                </h1>
                <p class="mt-4 text-lg text-neutral-600 leading-relaxed max-w-lg">
                  Confirm your expected dates, guest count, and any particular preferences to
                  finalize the reservation for this suite.
                </p>
              </div>

              <div
                class="surface relative border border-amber-900/10 shadow-lg rounded-4xl overflow-hidden backdrop-blur-xl bg-orange-50/60 p-1"
              >
                <div
                  class="p-6 md:p-8 space-y-6 bg-white/40 rounded-[1.75rem] border border-white/50"
                >
                  <div class="flex items-start justify-between gap-4 pb-6 border-b border-black/5">
                    <div class="flex items-center gap-4">
                      <div
                        class="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-800 shrink-0"
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
                          <path
                            d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                          ></path>
                          <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                      </div>
                      <div>
                        <p class="text-xs font-bold text-neutral-500 mb-1 uppercase tracking-wider">
                          Unit No.
                        </p>
                        <p class="text-xl font-bold text-neutral-900 leading-none">
                          Room {{ room.roomNumber }}
                        </p>
                      </div>
                    </div>
                    <div class="text-right">
                      <p class="text-xs font-bold text-neutral-500 mb-1 uppercase tracking-wider">
                        Capacity
                      </p>
                      <p
                        class="text-sm font-medium text-neutral-600 flex items-center justify-end gap-1.5"
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
                          class="text-amber-700/70"
                        >
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                          <circle cx="9" cy="7" r="4"></circle>
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                        Floor {{ room.floor }} &middot; {{ room.capacity }} guests
                      </p>
                    </div>
                  </div>

                  <div class="flex items-center justify-between gap-4 pt-2">
                    <div>
                      <p class="text-sm font-semibold text-neutral-500 mb-1">Base Nightly Rate</p>
                    </div>
                    <p class="text-3xl font-bold text-neutral-900">
                      {{ room.baseRate | currency: 'INR' : 'symbol' : '1.0-0' }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div class="relative w-full">
              <div
                class="absolute -top-10 -right-10 w-72 h-72 bg-amber-600/20 rounded-full blur-[80px] z-0"
              ></div>

              <form
                class="surface relative z-10 border border-white/60 shadow-2xl rounded-4xl p-6 sm:p-10 backdrop-blur-xl bg-white/80 flex flex-col gap-6"
                [formGroup]="form"
                (ngSubmit)="submit()"
              >
                <div class="text-center mb-2">
                  <h2 class="text-2xl font-bold text-neutral-900">Guest Details</h2>
                </div>

                <div class="grid grid-cols-1 gap-5">
                  <label class="flex flex-col gap-2">
                    <span class="text-sm font-semibold text-neutral-700">Check-in</span>
                    <input
                      type="datetime-local"
                      formControlName="checkIn"
                      class="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-white/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all text-sm"
                    />
                  </label>

                  <label class="flex flex-col gap-2">
                    <span class="text-sm font-semibold text-neutral-700">Check-out</span>
                    <input
                      type="datetime-local"
                      formControlName="checkOut"
                      class="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-white/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all text-sm"
                    />
                  </label>
                </div>

                <label class="flex flex-col gap-2">
                  <span class="text-sm font-semibold text-neutral-700">Total Guests</span>
                  <div class="relative">
                    <input
                      type="number"
                      min="1"
                      formControlName="guests"
                      class="w-full pl-11 pr-4 py-3 rounded-xl border border-neutral-200 bg-white/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all font-medium"
                    />
                  </div>
                </label>

                <label class="flex flex-col gap-2">
                  <span class="text-sm font-semibold text-neutral-700">Special Requests</span>
                  <textarea
                    formControlName="specialRequests"
                    rows="3"
                    class="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-white/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all resize-none placeholder:text-neutral-400"
                    placeholder="e.g., quiet room, high floor, anniversary..."
                  ></textarea>
                </label>

                <label class="flex flex-col gap-2">
                  <span class="text-sm font-semibold text-neutral-700">Payment Method</span>
                  <select
                    formControlName="paymentMethod"
                    class="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-white/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all text-sm"
                  >
                    <option value="cash">Cash at hotel</option>
                    <option value="online">Pay online (Razorpay)</option>
                  </select>
                </label>

                @if (error()) {
                  <div
                    class="p-3.5 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3"
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
                      class="text-red-600 shrink-0 mt-0.5"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <p class="text-sm font-medium text-red-800 m-0">{{ error() }}</p>
                  </div>
                }

                <button
                  type="submit"
                  [disabled]="submitting()"
                  class="button w-full shadow-lg shadow-amber-900/20 hover:scale-[1.02] transition-transform duration-200 py-4 mt-4 flex items-center justify-center gap-2 text-base font-bold bg-neutral-900 hover:bg-neutral-800 border-0"
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
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                  {{
                    form.getRawValue().paymentMethod === 'online'
                      ? 'Proceed to online payment'
                      : 'Confirm reservation'
                  }}
                </button>
                <p class="text-center text-xs text-neutral-400 font-medium">
                  {{
                    form.getRawValue().paymentMethod === 'online'
                      ? 'You will be redirected to Razorpay checkout.'
                      : 'Pay with cash at check-in.'
                  }}
                </p>
              </form>
            </div>
          </div>
        </section>
      }
    </div>
  `,
})
export class BookingCheckoutPageComponent {
  private razorpayScriptRequest: Promise<void> | null = null;
  private readonly platformId = inject(PLATFORM_ID);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly formBuilder = inject(FormBuilder);
  private readonly roomService = inject(RoomService);
  private readonly bookingService = inject(BookingService);
  private readonly billingService = inject(BillingService);

  readonly error = signal('');
  readonly submitting = signal(false);
  readonly room$ = this.route.paramMap.pipe(
    map((params) => params.get('roomId') ?? ''),
    switchMap((roomId) => this.roomService.getRoom(roomId)),
  );

  readonly form = this.formBuilder.nonNullable.group({
    checkIn: ['', Validators.required],
    checkOut: ['', Validators.required],
    guests: [1, [Validators.required, Validators.min(1)]],
    specialRequests: [''],
    paymentMethod: ['cash' as 'cash' | 'online', Validators.required],
  });

  async submit(): Promise<void> {
    this.error.set('');

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    const roomId = this.route.snapshot.paramMap.get('roomId') ?? '';
    const formValue = this.form.getRawValue();
    const payload = {
      roomId,
      checkIn: new Date(formValue.checkIn).toISOString(),
      checkOut: new Date(formValue.checkOut).toISOString(),
      guests: formValue.guests,
      specialRequests: formValue.specialRequests,
      paymentMethod: formValue.paymentMethod,
    };

    try {
      if (payload.paymentMethod === 'cash') {
        const booking = await firstValueFrom(this.bookingService.createBooking(payload));
        await this.router.navigate(['/booking/confirmation', booking.id]);
        return;
      }

      const onlineOrder = await firstValueFrom(this.billingService.createOnlineOrder(payload));
      const paymentResult = await this.openRazorpayCheckout(onlineOrder, roomId);
      const booking = await firstValueFrom(
        this.billingService.verifyOnlinePayment({
          sessionId: onlineOrder.sessionId,
          razorpayOrderId: paymentResult.razorpay_order_id,
          razorpayPaymentId: paymentResult.razorpay_payment_id,
          razorpaySignature: paymentResult.razorpay_signature,
        }),
      );
      await this.router.navigate(['/booking/confirmation', booking.id]);
    } catch (error) {
      this.error.set(this.getErrorMessage(error));
    } finally {
      this.submitting.set(false);
    }
  }

  private getErrorMessage(error: unknown): string {
    if (error && typeof error === 'object' && 'error' in error) {
      const apiError = error as { error?: { message?: string } };
      if (apiError.error?.message) {
        return apiError.error.message;
      }
    }

    return 'Unable to complete booking payment flow.';
  }

  private async ensureRazorpayScript(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) {
      throw new Error('Online payment is only available in browser mode');
    }

    if (window.Razorpay) {
      return;
    }

    if (!this.razorpayScriptRequest) {
      this.razorpayScriptRequest = new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Unable to load Razorpay checkout script'));
        document.body.appendChild(script);
      });
    }

    return this.razorpayScriptRequest;
  }

  private async openRazorpayCheckout(
    order: { keyId: string; amount: number; currency: string; razorpayOrderId: string },
    roomId: string,
  ): Promise<RazorpayPaymentResponse> {
    await this.ensureRazorpayScript();

    const RazorpayCtor = window.Razorpay;

    if (!RazorpayCtor) {
      throw new Error('Razorpay checkout is unavailable');
    }

    return new Promise<RazorpayPaymentResponse>((resolve, reject) => {
      const razorpay = new RazorpayCtor({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'StayWise',
        description: `Room booking payment (${roomId})`,
        order_id: order.razorpayOrderId,
        handler: (response: Record<string, string>) => {
          resolve({
            razorpay_order_id: response['razorpay_order_id'] ?? '',
            razorpay_payment_id: response['razorpay_payment_id'] ?? '',
            razorpay_signature: response['razorpay_signature'] ?? '',
          });
        },
        modal: {
          ondismiss: () => reject(new Error('Payment cancelled by user')),
        },
        theme: {
          color: '#0f172a',
        },
      });

      razorpay.open();
    });
  }
}
