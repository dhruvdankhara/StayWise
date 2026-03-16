import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from './api.service';

export interface GuestItem {
  _id: string;
  name: string;
  email: string;
  phone: string;
  latestBooking: string;
}

@Injectable({ providedIn: 'root' })
export class GuestService {
  private readonly api = inject(ApiService);

  listGuests(): Observable<GuestItem[]> {
    return this.api.get<GuestItem[]>('/guests');
  }

  createGuest(payload: { name: string; email: string; phone: string }): Observable<GuestItem> {
    return this.api.post<GuestItem>('/guests', payload);
  }
}
