import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { mapReview, mapRoom } from '../models/api-helpers';
import type { Review, RoomListItem } from '../models/app.models';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class RoomService {
  private readonly api = inject(ApiService);

  listRooms(filters?: Record<string, string | number>): Observable<RoomListItem[]> {
    return this.api
      .get<{ items: Record<string, unknown>[] }>('/rooms', filters)
      .pipe(map((result) => result.items.map(mapRoom)));
  }

  searchAvailable(filters: {
    checkIn: string;
    checkOut: string;
    type?: string;
    guests?: number;
  }): Observable<RoomListItem[]> {
    return this.api
      .get<Record<string, unknown>[]>('/rooms/available', filters)
      .pipe(map((items) => items.map(mapRoom)));
  }

  getRoom(id: string): Observable<RoomListItem> {
    return this.api.get<Record<string, unknown>>(`/rooms/${id}`).pipe(map(mapRoom));
  }

  createRoom(payload: Record<string, unknown>): Observable<RoomListItem> {
    return this.api.post<Record<string, unknown>>('/rooms', payload).pipe(map(mapRoom));
  }

  updateRoom(id: string, payload: Record<string, unknown>): Observable<RoomListItem> {
    return this.api.put<Record<string, unknown>>(`/rooms/${id}`, payload).pipe(map(mapRoom));
  }

  deactivateRoom(id: string): Observable<RoomListItem> {
    return this.api.delete<Record<string, unknown>>(`/rooms/${id}`).pipe(map(mapRoom));
  }

  roomReviews(roomId: string): Observable<Review[]> {
    return this.api.get<Record<string, unknown>[]>(`/reviews/room/${roomId}`).pipe(map((items) => items.map(mapReview)));
  }
}
