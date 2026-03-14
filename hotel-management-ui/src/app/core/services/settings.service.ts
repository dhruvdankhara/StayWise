import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { mapSettings } from '../models/api-helpers';
import type { HotelSettings } from '../models/app.models';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private readonly api = inject(ApiService);

  getSettings(): Observable<HotelSettings> {
    return this.api.get<Record<string, unknown>>('/settings').pipe(map(mapSettings));
  }

  updateSettings(payload: Record<string, unknown>): Observable<HotelSettings> {
    return this.api.put<Record<string, unknown>>('/settings', payload).pipe(map(mapSettings));
  }
}
