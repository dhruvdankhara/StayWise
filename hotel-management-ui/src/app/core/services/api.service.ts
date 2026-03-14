import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import type { ApiEnvelope } from '../models/app.models';

type QueryValue = string | number | boolean | null | undefined;

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;

  get<T>(path: string, params?: Record<string, QueryValue>): Observable<T> {
    return this.http
      .get<ApiEnvelope<T>>(`${this.baseUrl}${path}`, { params: this.buildParams(params) })
      .pipe(map((response) => response.data));
  }

  post<T>(path: string, payload: unknown): Observable<T> {
    return this.http.post<ApiEnvelope<T>>(`${this.baseUrl}${path}`, payload).pipe(map((response) => response.data));
  }

  put<T>(path: string, payload: unknown): Observable<T> {
    return this.http.put<ApiEnvelope<T>>(`${this.baseUrl}${path}`, payload).pipe(map((response) => response.data));
  }

  patch<T>(path: string, payload: unknown): Observable<T> {
    return this.http.patch<ApiEnvelope<T>>(`${this.baseUrl}${path}`, payload).pipe(map((response) => response.data));
  }

  delete<T>(path: string): Observable<T> {
    return this.http.delete<ApiEnvelope<T>>(`${this.baseUrl}${path}`).pipe(map((response) => response.data));
  }

  upload<T>(path: string, payload: FormData): Observable<T> {
    return this.http.post<ApiEnvelope<T>>(`${this.baseUrl}${path}`, payload).pipe(map((response) => response.data));
  }

  download(path: string, params?: Record<string, QueryValue>): Observable<Blob> {
    return this.http.get(`${this.baseUrl}${path}`, {
      params: this.buildParams(params),
      responseType: 'blob'
    });
  }

  private buildParams(source?: Record<string, QueryValue>): HttpParams {
    let params = new HttpParams();

    if (!source) {
      return params;
    }

    for (const [key, value] of Object.entries(source)) {
      if (value === undefined || value === null || value === '') {
        continue;
      }

      params = params.set(key, String(value));
    }

    return params;
  }
}
