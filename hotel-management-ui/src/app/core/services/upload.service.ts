import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { mapUploadResult } from '../models/api-helpers';
import type { UploadResult } from '../models/app.models';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class UploadService {
  private readonly api = inject(ApiService);

  upload(file: File): Observable<UploadResult> {
    const formData = new FormData();
    formData.append('file', file);
    return this.api.upload<Record<string, unknown>>('/uploads', formData).pipe(map(mapUploadResult));
  }
}
