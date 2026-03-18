import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

import type { Invoice, BookingListItem } from '../../core/models/app.models';
import { BillingService } from '../../core/services/billing.service';
import { BookingService } from '../../core/services/booking.service';

@Component({
  selector: 'app-receptionist-billing-page',
  imports: [CurrencyPipe, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="animate-fade-in relative z-10 max-w-4xl mx-auto pb-12">
      <section class="mb-8 lg:mb-12 text-center">
        <p
          class="text-sm font-bold text-emerald-700 uppercase tracking-widest mb-3 flex items-center justify-center gap-2"
        >
          <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
          Billing Desk
        </p>
        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900 mb-4">
          Accept Payment
        </h1>
        <p class="text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed">
          Select a booking to view its outstanding balance and record a payment.
        </p>
      </section>

      <div
        class="surface bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-black/5 shadow-sm p-8 sm:p-10 relative overflow-hidden"
      >
        <div
          class="absolute -top-32 -left-32 w-64 h-64 bg-emerald-500/10 blur-2xl rounded-full pointer-events-none"
        ></div>

        <form [formGroup]="paymentForm" (ngSubmit)="recordPayment()" class="relative z-10">
          <div class="mb-8">
            <label class="flex flex-col gap-1.5">
              <span class="text-xs font-semibold text-neutral-700 uppercase tracking-wide"
                >Select Booking</span
              >
              <select
                formControlName="bookingId"
                class="w-full px-4 py-3 bg-neutral-50 border border-black/5 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-base outline-none cursor-pointer"
              >
                <option value="" disabled selected>Select a booking to view balance...</option>
                @for (booking of recentBookings(); track booking.id) {
                  <option [value]="booking.id">
                    {{ booking.bookingRef }} - {{ booking.guest?.name || 'Guest' }} ({{
                      booking.status
                    }})
                  </option>
                }
              </select>
            </label>
          </div>

          @if (invoice(); as invoice) {
            <div
              class="bg-neutral-900 rounded-3xl p-6 mb-8 text-white shadow-lg flex flex-col sm:flex-row justify-between items-center sm:items-start gap-6"
            >
              <div class="flex-1 w-full relative">
                <p
                  class="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-4 flex items-center gap-2"
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
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                  Invoice Summary
                </p>
                <div
                  class="flex justify-between items-end border-b border-neutral-700/50 pb-3 mb-3"
                >
                  <span class="text-neutral-300 text-sm">Total Due</span>
                  <span class="font-medium">{{
                    invoice.total | currency: 'INR' : 'symbol' : '1.0-0'
                  }}</span>
                </div>
                <div
                  class="flex justify-between items-end border-b border-neutral-700/50 pb-3 mb-4"
                >
                  <span class="text-neutral-300 text-sm">Amount Paid</span>
                  <span class="font-medium text-emerald-400">{{
                    invoice.paidAmount || 0 | currency: 'INR' : 'symbol' : '1.0-0'
                  }}</span>
                </div>
                <div class="flex items-center gap-2">
                  @if (invoice.discount > 0) {
                    <span
                      class="inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-900/40 text-amber-500"
                    >
                      Discount: {{ invoice.discount | currency: 'INR' : 'symbol' : '1.0-0' }}
                    </span>
                  }
                </div>
              </div>

              <div
                class="w-full sm:w-auto bg-emerald-900/30 border border-emerald-800/50 rounded-2xl p-5 text-center flex flex-col justify-center items-center h-full min-h-30"
              >
                <p class="text-xs font-bold text-emerald-500/80 uppercase tracking-widest mb-1.5">
                  Remaining Balance
                </p>
                @if (invoice.total - (invoice.paidAmount || 0) > 0) {
                  <h2 class="text-3xl font-bold text-emerald-400 m-0 tracking-tight">
                    {{
                      invoice.total - (invoice.paidAmount || 0)
                        | currency: 'INR' : 'symbol' : '1.0-0'
                    }}
                  </h2>
                } @else {
                  <h2
                    class="text-2xl font-bold text-emerald-500 m-0 tracking-tight flex items-center gap-2"
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
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    Fully Paid
                  </h2>
                }
              </div>
            </div>
          }

          @if (error()) {
            <div
              class="mb-8 p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-amber-800"
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
                class="text-amber-600 mt-0.5 shrink-0"
              >
                <path
                  d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
                ></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              <div>
                <p class="font-bold text-sm mb-1">Notice</p>
                <p class="text-xs m-0">{{ error() }}</p>
              </div>
            </div>
          }

          @if (message()) {
            <div
              class="mb-8 p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3 text-emerald-800"
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
                class="text-emerald-600 mt-0.5 shrink-0"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <div>
                <p class="font-bold text-sm mb-1">Success</p>
                <p class="text-xs m-0">{{ message() }}</p>
              </div>
            </div>
          }

          <div
            class="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8 p-6 rounded-2xl bg-neutral-50/50 border border-black/5"
            [class.opacity-50]="!invoice()"
          >
            <label class="flex flex-col gap-1.5">
              <span class="text-xs font-semibold text-neutral-700 uppercase tracking-wide"
                >Amount Paying</span
              >
              <input
                type="number"
                formControlName="amount"
                class="w-full px-4 py-3 bg-white border border-black/5 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-base outline-none"
                placeholder="0"
                min="0"
              />
            </label>

            <label class="flex flex-col gap-1.5">
              <span class="text-xs font-semibold text-neutral-700 uppercase tracking-wide"
                >Payment Method</span
              >
              <select
                formControlName="method"
                class="w-full px-4 py-3 bg-white border border-black/5 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-base outline-none"
              >
                <option value="cash">Cash</option>
                <option value="card">Credit/Debit Card</option>
                <option value="upi">UPI / Online</option>
                <option value="bank_transfer">Bank Transfer</option>
              </select>
            </label>

            <label class="flex flex-col gap-1.5">
              <span class="text-xs font-semibold text-neutral-700 uppercase tracking-wide"
                >Transaction Ref</span
              >
              <input
                type="text"
                formControlName="providerPaymentId"
                class="w-full px-4 py-3 bg-white border border-black/5 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-base outline-none"
                placeholder="txn_id / optional"
              />
            </label>
          </div>

          <div class="flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              [disabled]="paymentForm.invalid || !invoice() || (paymentForm.value.amount || 0) <= 0"
              class="button flex-1 justify-center py-4 text-base font-semibold bg-emerald-600 hover:bg-emerald-700 border-0 shadow-lg shadow-emerald-900/20 text-white rounded-xl transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none disabled:shadow-none disabled:cursor-not-allowed"
            >
              Confirm Payment
            </button>
            <button
              type="button"
              [disabled]="!invoice()"
              class="button sm:flex-none px-8 justify-center py-4 text-base font-semibold bg-white hover:bg-neutral-50 text-neutral-700 border border-black/10 rounded-xl transition-all gap-2 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              (click)="downloadPdf()"
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
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Print Invoice
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class ReceptionistBillingPageComponent implements OnInit {
  private readonly billingService = inject(BillingService);
  private readonly bookingService = inject(BookingService);
  private readonly formBuilder = inject(FormBuilder);

  readonly message = signal('');
  readonly error = signal('');
  readonly invoice = signal<Invoice | null>(null);

  readonly recentBookings = signal<BookingListItem[]>([]);

  readonly paymentForm = this.formBuilder.nonNullable.group({
    bookingId: ['', Validators.required],
    amount: [{ value: 0, disabled: true }, [Validators.required, Validators.min(0.01)]],
    method: ['cash', Validators.required],
    providerPaymentId: [''],
  });

  async ngOnInit(): Promise<void> {
    try {
      const result = await firstValueFrom(this.bookingService.listBookings({ limit: 100 }));
      const activeBookings = result.items.filter((b) => b.status !== 'CANCELLED');
      this.recentBookings.set(activeBookings);
    } catch (e) {
      console.error('Failed to fetch bookings', e);
    }

    this.paymentForm.controls.bookingId.valueChanges.subscribe(async (bookingId) => {
      if (!bookingId) return;

      this.message.set('');
      this.error.set('');

      try {
        const inv = await firstValueFrom(this.billingService.getInvoice(bookingId));
        this.invoice.set(inv);
        const remaining = inv.total - (inv.paidAmount || 0);

        if (remaining > 0) {
          this.paymentForm.controls.amount.enable();
          this.paymentForm.patchValue({ amount: remaining });
        } else {
          this.paymentForm.controls.amount.disable();
          this.paymentForm.patchValue({ amount: 0 });
        }
      } catch (e) {
        try {
          const booking = this.recentBookings().find((b) => b.id === bookingId);
          const amt = booking?.totalAmount || 0;
          const generatedInv = await firstValueFrom(
            this.billingService.generateInvoice(bookingId, {
              lineItems: [
                {
                  description: 'Room Charge',
                  quantity: 1,
                  unitPrice: amt,
                },
              ],
              discount: 0,
            }),
          );
          this.invoice.set(generatedInv);

          const remaining = generatedInv.total - (generatedInv.paidAmount || 0);
          if (remaining > 0) {
            this.paymentForm.controls.amount.enable();
            this.paymentForm.patchValue({ amount: remaining });
          } else {
            this.paymentForm.controls.amount.disable();
            this.paymentForm.patchValue({ amount: 0 });
          }
        } catch (generateError) {
          this.invoice.set(null);
          this.paymentForm.controls.amount.disable();
          this.paymentForm.patchValue({ amount: 0 });
          this.error.set('Could not fetch or auto-generate an invoice for this booking.');
        }
      }
    });
  }

  async recordPayment(): Promise<void> {
    if (this.paymentForm.invalid) return;

    const value = this.paymentForm.getRawValue();
    try {
      this.message.set('');
      this.error.set('');
      const result = await firstValueFrom(
        this.billingService.recordPayment(value.bookingId, {
          amount: value.amount,
          method: value.method,
          providerPaymentId: value.providerPaymentId || undefined,
        }),
      );
      this.invoice.set(result.invoice);

      const remaining = result.invoice.total - (result.invoice.paidAmount || 0);
      if (remaining > 0) {
        this.paymentForm.patchValue({ amount: remaining });
        this.message.set(
          'Payment of ₹' +
            value.amount.toFixed(2) +
            ' recorded successfully. Balance remaining: ₹' +
            remaining.toFixed(2),
        );
      } else {
        this.paymentForm.controls.amount.disable();
        this.paymentForm.patchValue({ amount: 0 });
        this.message.set('Payment complete! The booking is Fully Paid.');
      }
    } catch {
      this.error.set('Unable to record payment. Please try again.');
    }
  }

  async downloadPdf(): Promise<void> {
    const bookingId = this.paymentForm.getRawValue().bookingId;
    if (!bookingId) return;

    try {
      const blob = await firstValueFrom(this.billingService.downloadInvoicePdf(bookingId));
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank', 'noopener');
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      this.error.set('Unable to download the invoice PDF.');
    }
  }
}
