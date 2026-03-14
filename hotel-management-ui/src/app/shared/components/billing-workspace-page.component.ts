import { CurrencyPipe, JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

import type { Invoice } from '../../core/models/app.models';
import { BillingService } from '../../core/services/billing.service';

@Component({
  selector: 'app-billing-workspace-page',
  imports: [CurrencyPipe, JsonPipe, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Billing workspace</p>
          <h1>Generate invoices, add charges, record payment, and download PDFs.</h1>
        </div>
      </div>
      <div class="section-grid">
        <form class="surface auth-form" [formGroup]="invoiceForm" (ngSubmit)="generateInvoice()">
          <label><span>Booking ID</span><input type="text" formControlName="bookingId" /></label>
          <label><span>Description</span><input type="text" formControlName="description" /></label>
          <label><span>Quantity</span><input type="number" formControlName="quantity" /></label>
          <label><span>Unit price</span><input type="number" formControlName="unitPrice" /></label>
          <label><span>Tax rate</span><input type="number" formControlName="taxRate" /></label>
          <label><span>Discount</span><input type="number" formControlName="discount" /></label>
          @if (message()) { <p>{{ message() }}</p> }
          @if (error()) { <p class="error-text">{{ error() }}</p> }
          <div class="button-row">
            <button type="submit" class="button">Generate invoice</button>
            <button type="button" class="button button--ghost" (click)="loadInvoice()">Load existing invoice</button>
            <button type="button" class="button button--ghost" (click)="addCharge()">Add charge</button>
          </div>
        </form>
        <form class="surface auth-form" [formGroup]="paymentForm" (ngSubmit)="recordPayment()">
          <label><span>Booking ID</span><input type="text" formControlName="bookingId" /></label>
          <label><span>Amount</span><input type="number" formControlName="amount" /></label>
          <label><span>Method</span><input type="text" formControlName="method" /></label>
          <label><span>Provider payment ID</span><input type="text" formControlName="providerPaymentId" /></label>
          <button type="submit" class="button">Record payment</button>
          <button type="button" class="button button--ghost" (click)="downloadPdf()">Download invoice PDF</button>
        </form>
      </div>
      @if (invoice(); as invoice) {
        <article class="surface section-panel">
          <p class="eyebrow">Invoice preview</p>
          <h2>{{ invoice.total | currency: 'INR' : 'symbol' : '1.0-0' }}</h2>
          <pre>{{ invoice | json }}</pre>
        </article>
      }
    </section>
  `
})
export class BillingWorkspacePageComponent {
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
    discount: [0, Validators.required]
  });

  readonly paymentForm = this.formBuilder.nonNullable.group({
    bookingId: ['', Validators.required],
    amount: [1000, Validators.required],
    method: ['cash', Validators.required],
    providerPaymentId: ['']
  });

  async generateInvoice(): Promise<void> {
    const value = this.invoiceForm.getRawValue();
    try {
      const invoice = await firstValueFrom(
        this.billingService.generateInvoice(value.bookingId, {
          lineItems: [{ description: value.description, quantity: value.quantity, unitPrice: value.unitPrice }],
          taxRate: value.taxRate,
          discount: value.discount
        })
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
      const invoice = await firstValueFrom(this.billingService.getInvoice(this.invoiceForm.getRawValue().bookingId));
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
          unitPrice: value.unitPrice
        })
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
          providerPaymentId: value.providerPaymentId || undefined
        })
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
