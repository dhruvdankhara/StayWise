import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { mapTask } from '../models/api-helpers';
import type { HousekeepingTask } from '../models/app.models';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class HousekeepingService {
  private readonly api = inject(ApiService);

  listTasks(): Observable<HousekeepingTask[]> {
    return this.api.get<Record<string, unknown>[]>('/housekeeping').pipe(map((items) => items.map(mapTask)));
  }

  createTask(payload: Record<string, unknown>): Observable<HousekeepingTask> {
    return this.api.post<Record<string, unknown>>('/housekeeping', payload).pipe(map(mapTask));
  }

  updateTask(id: string, payload: Record<string, unknown>): Observable<HousekeepingTask> {
    return this.api.put<Record<string, unknown>>(`/housekeeping/${id}`, payload).pipe(map(mapTask));
  }

  updateStatus(id: string, payload: Record<string, unknown>): Observable<HousekeepingTask> {
    return this.api.patch<Record<string, unknown>>(`/housekeeping/${id}/status`, payload).pipe(map(mapTask));
  }
}
