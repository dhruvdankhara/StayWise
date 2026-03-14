import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { mapBooking } from '../models/api-helpers';
import type { BookingListItem, PagedResult } from '../models/app.models';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private readonly api = inject(ApiService);

  listBookings(filters?: Record<string, string | number>): Observable<PagedResult<BookingListItem>> {
    return this.api.get<{ items: Record<string, unknown>[]; page: number; limit: number; total: number }>(
      '/bookings',
      filters
    ).pipe(
      map((result) => ({
        ...result,
        items: result.items.map(mapBooking)
      }))
    );
  }

  listMyBookings(): Observable<BookingListItem[]> {
    return this.api.get<Record<string, unknown>[]>('/bookings/my').pipe(map((items) => items.map(mapBooking)));
  }

  getBooking(id: string): Observable<BookingListItem> {
    return this.api.get<Record<string, unknown>>(`/bookings/${id}`).pipe(map(mapBooking));
  }

  createBooking(payload: Record<string, unknown>): Observable<BookingListItem> {
    return this.api.post<Record<string, unknown>>('/bookings', payload).pipe(map(mapBooking));
  }

  updateBooking(id: string, payload: Record<string, unknown>): Observable<BookingListItem> {
    return this.api.put<Record<string, unknown>>(`/bookings/${id}`, payload).pipe(map(mapBooking));
  }

  cancelBooking(id: string, reason: string): Observable<BookingListItem> {
    return this.api.post<Record<string, unknown>>(`/bookings/${id}/cancel`, { reason }).pipe(map(mapBooking));
  }

  checkIn(id: string): Observable<BookingListItem> {
    return this.api.post<Record<string, unknown>>(`/bookings/${id}/checkin`, {}).pipe(map(mapBooking));
  }

  checkOut(id: string): Observable<BookingListItem> {
    return this.api.post<Record<string, unknown>>(`/bookings/${id}/checkout`, {}).pipe(map(mapBooking));
  }
}
