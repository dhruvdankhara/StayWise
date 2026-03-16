import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { mapBooking, mapInvoice } from '../models/api-helpers';
import type {
  BookingListItem,
  CreateOnlineOrderPayload,
  Invoice,
  OnlineOrderResult,
  VerifyOnlinePaymentPayload,
} from '../models/app.models';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class BillingService {
  private readonly api = inject(ApiService);

  getInvoice(bookingId: string): Observable<Invoice> {
    return this.api.get<Record<string, unknown>>(`/billing/${bookingId}`).pipe(map(mapInvoice));
  }

  generateInvoice(bookingId: string, payload: Record<string, unknown>): Observable<Invoice> {
    return this.api
      .post<Record<string, unknown>>(`/billing/${bookingId}`, payload)
      .pipe(map(mapInvoice));
  }

  addCharge(bookingId: string, payload: Record<string, unknown>): Observable<Invoice> {
    return this.api
      .put<Record<string, unknown>>(`/billing/${bookingId}/charges`, payload)
      .pipe(map(mapInvoice));
  }

  recordPayment(
    bookingId: string,
    payload: Record<string, unknown>,
  ): Observable<{ invoice: Invoice; paymentStatus: string }> {
    return this.api
      .post<{
        invoice: Record<string, unknown>;
        paymentStatus: string;
      }>(`/billing/${bookingId}/payment`, payload)
      .pipe(
        map((response) => ({
          invoice: mapInvoice(response.invoice),
          paymentStatus: response.paymentStatus,
        })),
      );
  }

  createOnlineOrder(payload: CreateOnlineOrderPayload): Observable<OnlineOrderResult> {
    return this.api.post<OnlineOrderResult>('/billing/online/order', payload);
  }

  verifyOnlinePayment(payload: VerifyOnlinePaymentPayload): Observable<BookingListItem> {
    return this.api
      .post<Record<string, unknown>>('/billing/online/verify', payload)
      .pipe(map(mapBooking));
  }

  downloadInvoicePdf(bookingId: string): Observable<Blob> {
    return this.api.download(`/billing/${bookingId}/pdf`);
  }
}
