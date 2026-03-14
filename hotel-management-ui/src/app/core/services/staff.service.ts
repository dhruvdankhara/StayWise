import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { mapUserProfile } from '../models/api-helpers';
import type { UserProfile } from '../models/app.models';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class StaffService {
  private readonly api = inject(ApiService);

  listStaff(): Observable<UserProfile[]> {
    return this.api.get<Record<string, unknown>[]>('/staff').pipe(map((items) => items.map(mapUserProfile)));
  }

  createStaff(payload: Record<string, unknown>): Observable<UserProfile> {
    return this.api.post<Record<string, unknown>>('/staff', payload).pipe(map(mapUserProfile));
  }

  updateStaff(id: string, payload: Record<string, unknown>): Observable<UserProfile> {
    return this.api.put<Record<string, unknown>>(`/staff/${id}`, payload).pipe(map(mapUserProfile));
  }

  deactivateStaff(id: string): Observable<UserProfile> {
    return this.api.delete<Record<string, unknown>>(`/staff/${id}`).pipe(map(mapUserProfile));
  }
}
