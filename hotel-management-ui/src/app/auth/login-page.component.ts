import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

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
        <p>Use any seeded account email with <strong>Password@123</strong> to enter the corresponding panel.</p>
        <div class="surface auth-demo">
          <p class="eyebrow">Demo accounts</p>
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
    email: ['guest@staywise.com', [Validators.required, Validators.email]],
    password: ['Password@123', [Validators.required, Validators.minLength(8)]]
  });

  async submit(): Promise<void> {
    this.error.set('');

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, password } = this.form.getRawValue();
    const success = await this.authService.login(email, password);

    if (!success) {
      this.error.set('Invalid credentials. Use a demo email with Password@123.');
      return;
    }

    const role = this.authService.user()?.role;
    const destination =
      role === 'admin'
        ? '/admin'
        : role === 'hotel_manager'
          ? '/hotel-manager'
          : role === 'receptionist'
            ? '/receptionist'
            : role === 'cleaning_staff'
              ? '/cleaning-staff'
              : '/guest';

    await this.router.navigateByUrl(destination);
  }
}
