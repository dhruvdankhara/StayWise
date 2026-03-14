import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { mapReview } from '../models/api-helpers';
import type { Review } from '../models/app.models';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private readonly api = inject(ApiService);

  listAll(): Observable<Review[]> {
    return this.api.get<Record<string, unknown>[]>('/reviews').pipe(map((items) => items.map(mapReview)));
  }

  listRoomReviews(roomId: string): Observable<Review[]> {
    return this.api.get<Record<string, unknown>[]>(`/reviews/room/${roomId}`).pipe(map((items) => items.map(mapReview)));
  }

  submitReview(payload: Record<string, unknown>): Observable<Review> {
    return this.api.post<Record<string, unknown>>('/reviews', payload).pipe(map(mapReview));
  }

  updateVisibility(id: string, isVisible: boolean): Observable<Review> {
    return this.api.patch<Record<string, unknown>>(`/reviews/${id}/visibility`, { isVisible }).pipe(map(mapReview));
  }
}
