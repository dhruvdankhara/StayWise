import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import type { ReportRow } from '../models/app.models';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class ReportService {
  private readonly api = inject(ApiService);

  occupancyReport(params?: Record<string, string>): Observable<ReportRow[]> {
    return this.api.get<ReportRow[]>('/reports/occupancy', params);
  }

  revenueReport(params?: Record<string, string>): Observable<ReportRow[]> {
    return this.api.get<ReportRow[]>('/reports/revenue', params);
  }

  staffReport(params?: Record<string, string>): Observable<ReportRow[]> {
    return this.api.get<ReportRow[]>('/reports/staff', params);
  }

  guestReport(params?: Record<string, string>): Observable<ReportRow[]> {
    return this.api.get<ReportRow[]>('/reports/guests', params);
  }

  downloadReport(path: '/reports/occupancy' | '/reports/revenue' | '/reports/staff' | '/reports/guests', format: 'pdf' | 'xlsx'): Observable<Blob> {
    return this.api.download(path, { format });
  }
}
