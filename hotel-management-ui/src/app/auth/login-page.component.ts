import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { dashboardRouteByRole } from '../core/models/navigation';
import { AuthService } from '../core/services/auth.service';
import { BrandMarkComponent } from '../shared/components/brand-mark.component';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule, RouterLink, BrandMarkComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="auth-shell container">
      <div class="auth-copy">
        <app-brand-mark />
        <h1>Sign in to StayWise</h1>
        <p>Access the public booking flow or your role-based operations panel with a live API-backed session.</p>
        <div class="surface auth-demo">
          <p class="eyebrow">Seeded accounts</p>
          <p>
            <code>admin@staywise.com</code>, <code>manager@staywise.com</code>,
            <code>reception@staywise.com</code>, <code>cleaning@staywise.com</code>,
            <code>guest@staywise.com</code>
          </p>
        </div>
      </div>
      <form class="surface auth-form" [formGroup]="form" (ngSubmit)="submit()">
        <label>
          <span>Email</span>
          <input type="email" formControlName="email" placeholder="guest@staywise.com" />
        </label>
        <label>
          <span>Password</span>
          <input type="password" formControlName="password" placeholder="Password@123" />
        </label>
        @if (error()) {
          <p class="error-text">{{ error() }}</p>
        }
        <button type="submit" class="button button--full">Continue</button>
        <a routerLink="/auth/forgot-password">Forgot your password?</a>
        <a routerLink="/auth/register">Need an account? Register as a guest</a>
      </form>
    </section>
  `
})
export class LoginPageComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  readonly error = signal('');
  readonly form = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  async submit(): Promise<void> {
    this.error.set('');

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, password } = this.form.getRawValue();
    try {
      await this.authService.login(email, password);
    } catch {
      this.error.set('Invalid credentials or the API is unavailable.');
      return;
    }

    const role = this.authService.user()?.role;
    await this.router.navigateByUrl(role ? dashboardRouteByRole[role] : '/guest');
  }
}
