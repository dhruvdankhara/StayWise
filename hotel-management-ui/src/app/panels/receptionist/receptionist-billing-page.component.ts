import { CurrencyPipe, JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

import type { Invoice } from '../../core/models/app.models';
import { BillingService } from '../../core/services/billing.service';

@Component({
  selector: 'app-receptionist-billing-page',
  imports: [CurrencyPipe, JsonPipe, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="animate-fade-in relative z-10 max-w-[1600px] mx-auto pb-12">
      <!-- Header -->
      <section class="mb-8 lg:mb-12">
        <p
          class="text-sm font-bold text-amber-700 uppercase tracking-widest mb-3 flex items-center gap-2"
        >
          <span class="w-2 h-2 rounded-full bg-amber-500"></span>
          Billing Workspace
        </p>
        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900 mb-4">
          Invoices & Payments
        </h1>
        <p class="text-lg text-neutral-600 max-w-2xl leading-relaxed">
          Generate invoices, add line-item charges, record external payments, and download finalized
          invoice PDFs.
        </p>
      </section>

      <!-- Main Action Grid -->
      <div class="grid grid-cols-1 gap-8">
        <!-- Left Column: Invoice Generation & Charges -->
        <article
          class="surface bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-black/5 shadow-sm p-8 sm:p-10 relative overflow-hidden flex flex-col h-full"
        >
          <div
            class="absolute -top-32 -left-32 w-64 h-64 bg-amber-500/10 blur-[40px] rounded-full pointer-events-none"
          ></div>

          <div class="flex items-center gap-4 mb-8 relative z-10">
            <div
              class="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-900/10 shrink-0"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
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
            </div>
            <div>
              <h2 class="text-xl font-bold text-neutral-900 m-0">Invoice Controls</h2>
              <p class="text-sm text-neutral-500">Create or modify booking invoices</p>
            </div>
          </div>

          <form
            class="flex-1 flex flex-col relative z-10"
            [formGroup]="invoiceForm"
            (ngSubmit)="generateInvoice()"
          >
            <div class="flex flex-col gap-5 mb-8 flex-1">
              <label class="flex flex-col gap-1.5">
                <span class="text-xs font-semibold text-neutral-700 uppercase tracking-wide"
                  >Booking ID</span
                >
                <input
                  type="text"
                  formControlName="bookingId"
                  class="w-full px-4 py-2.5 bg-neutral-50 border border-black/5 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-sm outline-none"
                  placeholder="Paste booking reference here"
                />
              </label>

              <div
                class="p-5 rounded-2xl border border-black/5 bg-neutral-50/50 flex flex-col gap-4"
              >
                <p class="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1">
                  Line Item Details
                </p>
                <label class="flex flex-col gap-1.5">
                  <span class="text-xs font-semibold text-neutral-700">Description</span>
                  <input
                    type="text"
                    formControlName="description"
                    class="w-full px-4 py-2 bg-white border border-black/5 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-sm outline-none"
                  />
                </label>

                <div class="grid grid-cols-2 gap-4">
                  <label class="flex flex-col gap-1.5">
                    <span class="text-xs font-semibold text-neutral-700">Quantity</span>
                    <input
                      type="number"
                      formControlName="quantity"
                      class="w-full px-4 py-2 bg-white border border-black/5 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-sm outline-none"
                    />
                  </label>
                  <label class="flex flex-col gap-1.5">
                    <span class="text-xs font-semibold text-neutral-700">Unit Price</span>
                    <input
                      type="number"
                      formControlName="unitPrice"
                      class="w-full px-4 py-2 bg-white border border-black/5 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-sm outline-none"
                    />
                  </label>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <label class="flex flex-col gap-1.5">
                  <span class="text-xs font-semibold text-neutral-700 uppercase tracking-wide"
                    >Tax Rate (%)</span
                  >
                  <input
                    type="number"
                    formControlName="taxRate"
                    class="w-full px-4 py-2.5 bg-neutral-50 border border-black/5 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-sm outline-none"
                  />
                </label>
                <label class="flex flex-col gap-1.5">
                  <span class="text-xs font-semibold text-neutral-700 uppercase tracking-wide"
                    >Discount Amount</span
                  >
                  <input
                    type="number"
                    formControlName="discount"
                    class="w-full px-4 py-2.5 bg-neutral-50 border border-black/5 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-sm outline-none"
                  />
                </label>
              </div>
            </div>

            @if (message()) {
              <div
                class="mb-6 p-3 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center gap-3 animate-fade-in text-emerald-800 text-xs font-medium"
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
                  class="text-emerald-600"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                {{ message() }}
              </div>
            }
            @if (error()) {
              <div
                class="mb-6 p-3 rounded-xl bg-red-50 border border-red-100 flex items-center gap-3 animate-fade-in text-red-800 text-xs font-medium"
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
                  class="text-red-600"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                {{ error() }}
              </div>
            }

            <div class="flex flex-col sm:flex-row gap-3 mt-auto border-t border-black/5 pt-6">
              <button
                type="submit"
                class="button flex-1 justify-center py-2.5 text-sm bg-amber-800 hover:bg-amber-900 border-0 shadow-lg shadow-amber-900/20 text-white rounded-xl transition-transform hover:-translate-y-0.5 whitespace-nowrap"
              >
                Regenerate Invoice
              </button>
              <button
                type="button"
                class="button flex-1 justify-center py-2.5 text-sm bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border-0 rounded-xl transition-colors whitespace-nowrap"
                (click)="loadInvoice()"
              >
                Load Existing
              </button>
              <button
                type="button"
                class="button flex-1 justify-center py-2.5 text-sm bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl transition-colors whitespace-nowrap"
                (click)="addCharge()"
              >
                + Add Charge
              </button>
            </div>
          </form>
        </article>

        <!-- Right Column: Payments & Preview -->
        <div class="flex flex-col gap-8 lg:gap-12">
          <!-- Payment Recording -->
          <form
            class="surface bg-emerald-50/30 backdrop-blur-xl rounded-[2.5rem] border border-black/5 shadow-sm p-8"
            [formGroup]="paymentForm"
            (ngSubmit)="recordPayment()"
          >
            <div class="flex items-center gap-4 mb-6">
              <div
                class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shrink-0"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <line x1="12" y1="1" x2="12" y2="23"></line>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
              </div>
              <div>
                <h2 class="text-xl font-bold text-neutral-900 m-0">Record Payment</h2>
                <p class="text-sm text-neutral-500">Log cash, card, or external payments</p>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <label class="flex flex-col gap-1.5 sm:col-span-2">
                <span class="text-xs font-semibold text-neutral-700 uppercase tracking-wide"
                  >Booking ID</span
                >
                <input
                  type="text"
                  formControlName="bookingId"
                  class="w-full px-4 py-2.5 bg-white border border-black/5 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm outline-none"
                />
              </label>

              <label class="flex flex-col gap-1.5">
                <span class="text-xs font-semibold text-neutral-700 uppercase tracking-wide"
                  >Amount Paid</span
                >
                <input
                  type="number"
                  formControlName="amount"
                  class="w-full px-4 py-2.5 bg-white border border-black/5 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm outline-none"
                />
              </label>

              <label class="flex flex-col gap-1.5">
                <span class="text-xs font-semibold text-neutral-700 uppercase tracking-wide"
                  >Payment Method</span
                >
                <input
                  type="text"
                  formControlName="method"
                  class="w-full px-4 py-2.5 bg-white border border-black/5 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm outline-none"
                />
              </label>

              <label class="flex flex-col gap-1.5 sm:col-span-2">
                <span class="text-xs font-semibold text-neutral-700 uppercase tracking-wide"
                  >Provider Ref (Optional)</span
                >
                <input
                  type="text"
                  formControlName="providerPaymentId"
                  class="w-full px-4 py-2.5 bg-white border border-black/5 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm outline-none"
                  placeholder="e.g., txn_123456789"
                />
              </label>
            </div>

            <div class="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="submit"
                class="button flex-1 justify-center py-3 text-sm bg-emerald-600 hover:bg-emerald-700 border-0 shadow-lg shadow-emerald-900/20 text-white rounded-xl transition-transform hover:-translate-y-0.5"
              >
                Confirm Payment
              </button>
              <button
                type="button"
                class="button flex-1 justify-center py-3 text-sm bg-white hover:bg-neutral-50 text-neutral-700 border border-black/10 rounded-xl transition-colors gap-2 flex items-center"
                (click)="downloadPdf()"
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
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Download PDF
              </button>
            </div>
          </form>

          <!-- JSON Preview Area -->
          @if (invoice(); as invoice) {
            <article
              class="surface bg-neutral-900 rounded-[2.5rem] p-8 shadow-xl text-neutral-300 relative overflow-hidden flex-1"
            >
              <div
                class="absolute top-0 right-0 p-8 border-l border-b border-neutral-700/50 bg-neutral-800/50 rounded-bl-3xl"
              >
                <p class="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1">
                  Total Due
                </p>
                <h2 class="text-2xl font-bold text-white m-0 tracking-tight">
                  {{ invoice.total | currency: 'INR' : 'symbol' : '1.0-0' }}
                </h2>
              </div>

              <div class="flex items-center gap-3 mb-6">
                <div
                  class="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400"
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
                    <polyline points="16 18 22 12 16 6"></polyline>
                    <polyline points="8 6 2 12 8 18"></polyline>
                  </svg>
                </div>
                <h3 class="text-sm font-semibold text-white uppercase tracking-widest m-0">
                  JSON Data Preview
                </h3>
              </div>

              <div
                class="bg-black/50 rounded-xl p-4 overflow-auto max-h-[300px] border border-neutral-800 text-xs font-mono text-emerald-400"
              >
                <pre class="m-0">{{ invoice | json }}</pre>
              </div>
            </article>
          }
        </div>
      </div>
    </div>
  `,
})
export class ReceptionistBillingPageComponent {
  private readonly billingService = inject(BillingService);
  private readonly formBuilder = inject(FormBuilder);
  readonly message = signal('');
  readonly error = signal('');
  readonly invoice = signal<Invoice | null>(null);

  readonly invoiceForm = this.formBuilder.nonNullable.group({
    bookingId: ['', Validators.required],
    description: ['Room stay charges', Validators.required],
    quantity: [1, Validators.required],
    unitPrice: [5000, Validators.required],
    taxRate: [18, Validators.required],
    discount: [0, Validators.required],
  });

  readonly paymentForm = this.formBuilder.nonNullable.group({
    bookingId: ['', Validators.required],
    amount: [1000, Validators.required],
    method: ['cash', Validators.required],
    providerPaymentId: [''],
  });

  async generateInvoice(): Promise<void> {
    const value = this.invoiceForm.getRawValue();
    try {
      const invoice = await firstValueFrom(
        this.billingService.generateInvoice(value.bookingId, {
          lineItems: [
            {
              description: value.description,
              quantity: value.quantity,
              unitPrice: value.unitPrice,
            },
          ],
          taxRate: value.taxRate,
          discount: value.discount,
        }),
      );
      this.invoice.set(invoice);
      this.message.set('Invoice generated.');
    } catch {
      this.error.set('Unable to generate the invoice.');
    }
  }

  async loadInvoice(): Promise<void> {
    this.message.set('');
    this.error.set('');

    try {
      const invoice = await firstValueFrom(
        this.billingService.getInvoice(this.invoiceForm.getRawValue().bookingId),
      );
      this.invoice.set(invoice);
      this.message.set('Invoice loaded.');
    } catch {
      this.error.set('Unable to load the invoice.');
    }
  }

  async addCharge(): Promise<void> {
    const value = this.invoiceForm.getRawValue();
    try {
      const invoice = await firstValueFrom(
        this.billingService.addCharge(value.bookingId, {
          description: value.description,
          quantity: value.quantity,
          unitPrice: value.unitPrice,
        }),
      );
      this.invoice.set(invoice);
      this.message.set('Charge added.');
    } catch {
      this.error.set('Unable to add the charge.');
    }
  }

  async recordPayment(): Promise<void> {
    const value = this.paymentForm.getRawValue();
    try {
      const result = await firstValueFrom(
        this.billingService.recordPayment(value.bookingId, {
          amount: value.amount,
          method: value.method,
          providerPaymentId: value.providerPaymentId || undefined,
        }),
      );
      this.invoice.set(result.invoice);
      this.message.set(`Payment recorded. Status: ${result.paymentStatus}`);
    } catch {
      this.error.set('Unable to record payment.');
    }
  }

  async downloadPdf(): Promise<void> {
    try {
      const bookingId = this.paymentForm.getRawValue().bookingId;
      const blob = await firstValueFrom(this.billingService.downloadInvoicePdf(bookingId));
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank', 'noopener');
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      this.error.set('Unable to download the invoice PDF.');
    }
  }
}
