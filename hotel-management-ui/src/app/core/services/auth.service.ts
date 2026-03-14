import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { demoUsers } from '../data/demo-data';
import type { SessionUser } from '../models/app.models';
import { ApiService } from './api.service';

const STORAGE_KEY = 'staywise-session';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);
  private readonly api = inject(ApiService);
  readonly user = signal<SessionUser | null>(this.readStoredUser());

  get isAuthenticated(): boolean {
    return this.user() !== null;
  }

  async login(email: string, password: string): Promise<boolean> {
    if (password !== 'Password@123') {
      return false;
    }

    try {
      const result = await firstValueFrom(
        this.api.post<{ data?: { user?: SessionUser } }>('/auth/login', { email, password }, {})
      );
      const remoteUser = result.data?.user;

      if (remoteUser) {
        this.setUser(remoteUser);
        return true;
      }
    } catch {
      // fall back to demo users
    }

    const localUser = demoUsers.find((item) => item.email.toLowerCase() === email.toLowerCase()) ?? null;

    if (!localUser) {
      return false;
    }

    this.setUser(localUser);
    return true;
  }

  async register(payload: { name: string; email: string; phone: string; password: string }): Promise<boolean> {
    if (payload.password.length < 8) {
      return false;
    }

    const guest: SessionUser = {
      id: `guest-${Date.now()}`,
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      role: 'guest'
    };

    this.setUser(guest);
    return true;
  }

  logout(): void {
    this.user.set(null);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(STORAGE_KEY);
    }
    void this.router.navigateByUrl('/');
  }

  private setUser(user: SessionUser): void {
    this.user.set(user);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    }
  }

  private readStoredUser(): SessionUser | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as SessionUser) : null;
  }
}
