import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { mapTask } from '../models/api-helpers';
import type { HousekeepingTask } from '../models/app.models';
import { ApiService } from './api.service';

export interface HousekeepingAssignee {
  id: string;
  name: string;
  email?: string;
}

const mapAssignee = (value: Record<string, unknown>): HousekeepingAssignee => ({
  id: String(value['id'] ?? value['_id'] ?? ''),
  name: String(value['name'] ?? ''),
  email: value['email'] ? String(value['email']) : undefined,
});

@Injectable({ providedIn: 'root' })
export class HousekeepingService {
  private readonly api = inject(ApiService);

  listTasks(): Observable<HousekeepingTask[]> {
    return this.api
      .get<Record<string, unknown>[]>('/housekeeping')
      .pipe(map((items) => items.map(mapTask)));
  }

  createTask(payload: Record<string, unknown>): Observable<HousekeepingTask> {
    return this.api.post<Record<string, unknown>>('/housekeeping', payload).pipe(map(mapTask));
  }

  updateTask(id: string, payload: Record<string, unknown>): Observable<HousekeepingTask> {
    return this.api.put<Record<string, unknown>>(`/housekeeping/${id}`, payload).pipe(map(mapTask));
  }

  updateStatus(id: string, payload: Record<string, unknown>): Observable<HousekeepingTask> {
    return this.api
      .patch<Record<string, unknown>>(`/housekeeping/${id}/status`, payload)
      .pipe(map(mapTask));
  }

  listAssignableStaff(): Observable<HousekeepingAssignee[]> {
    return this.api
      .get<Record<string, unknown>[]>('/housekeeping/assignees')
      .pipe(map((items) => items.map(mapAssignee)));
  }

  deleteTask(id: string): Observable<HousekeepingTask> {
    return this.api.delete<Record<string, unknown>>(`/housekeeping/${id}`).pipe(map(mapTask));
  }
}
