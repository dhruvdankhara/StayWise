import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { mapUserProfile } from '../models/api-helpers';
import type { AuthSession, UserProfile } from '../models/app.models';
import { ApiService } from './api.service';

const TOKEN_STORAGE_KEY = 'staywise-token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);
  private readonly api = inject(ApiService);
  private bootstrapRequest: Promise<void> | null = null;

  readonly token = signal<string | null>(this.readStoredToken());
  readonly user = signal<UserProfile | null>(null);
  readonly ready = signal(false);

  get isAuthenticated(): boolean {
    return this.user() !== null;
  }

  async bootstrap(): Promise<void> {
    if (this.ready()) {
      return;
    }

    if (!this.token()) {
      this.ready.set(true);
      return;
    }

    if (this.bootstrapRequest) {
      return this.bootstrapRequest;
    }

    this.bootstrapRequest = this.refreshCurrentUser().finally(() => {
      this.ready.set(true);
      this.bootstrapRequest = null;
    });

    return this.bootstrapRequest;
  }

  async login(email: string, password: string): Promise<boolean> {
    const session = await firstValueFrom(
      this.api.post<AuthSession>('/auth/login', { email, password }),
    );
    this.persistToken(session.token);
    await this.refreshCurrentUser(session.user);
    return true;
  }

  async register(payload: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }): Promise<boolean> {
    const session = await firstValueFrom(this.api.post<AuthSession>('/auth/register', payload));
    this.persistToken(session.token);
    await this.refreshCurrentUser(session.user);
    return true;
  }

  async forgotPassword(email: string): Promise<void> {
    await firstValueFrom(this.api.post('/auth/forgot-password', { email }));
  }

  async resetPassword(token: string, password: string): Promise<void> {
    await firstValueFrom(this.api.post('/auth/reset-password', { token, password }));
  }

  async verifyEmail(token: string): Promise<void> {
    await firstValueFrom(this.api.post('/auth/verify-email', { token }));
    await this.refreshCurrentUser();
  }

  async updateProfile(payload: Record<string, unknown>): Promise<UserProfile> {
    const response = await firstValueFrom(
      this.api.put<Record<string, unknown>>('/auth/me', payload),
    );
    const user = mapUserProfile(response);
    this.user.set(user);
    return user;
  }

  async uploadProfileImage(file: File): Promise<UserProfile> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await firstValueFrom(
      this.api.upload<Record<string, unknown>>('/auth/me/profile-image', formData),
    );
    const user = mapUserProfile(response);
    this.user.set(user);
    return user;
  }

  async logout(): Promise<void> {
    this.clearSession();
    await this.router.navigateByUrl('/auth/login');
  }

  clearSession(markReady = true): void {
    this.token.set(null);
    this.user.set(null);
    if (markReady) {
      this.ready.set(true);
    }

    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  }

  private async refreshCurrentUser(fallbackUser?: UserProfile): Promise<void> {
    try {
      const response = await firstValueFrom(this.api.get<Record<string, unknown>>('/auth/me'));
      this.user.set(mapUserProfile(response));
    } catch {
      if (fallbackUser) {
        this.user.set(fallbackUser);
      } else {
        this.clearSession();
      }
    }
  }

  private persistToken(token: string): void {
    this.token.set(token);
    this.ready.set(true);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    }
  }

  private readStoredToken(): string | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    return localStorage.getItem(TOKEN_STORAGE_KEY);
  }
}
