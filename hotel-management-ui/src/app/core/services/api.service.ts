import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';

import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;

  get<T>(path: string, fallback: T): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${path}`).pipe(catchError(() => of(fallback)));
  }

  post<T>(path: string, payload: unknown, fallback: T): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${path}`, payload).pipe(catchError(() => of(fallback)));
  }
}
