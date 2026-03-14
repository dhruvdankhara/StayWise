import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { AuthService } from '../core/services/auth.service';
import { BrandMarkComponent } from '../shared/components/brand-mark.component';

@Component({
  selector: 'app-forgot-password-page',
  imports: [ReactiveFormsModule, RouterLink, BrandMarkComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="auth-shell container">
      <div class="auth-copy">
        <app-brand-mark />
        <h1>Reset access</h1>
        <p>Request a password reset token that can be used on the reset-password screen.</p>
      </div>
      <form class="surface auth-form" [formGroup]="form" (ngSubmit)="submit()">
        <label>
          <span>Email</span>
          <input type="email" formControlName="email" placeholder="guest@staywise.com" />
        </label>
        @if (message()) {
          <p>{{ message() }}</p>
        }
        @if (error()) {
          <p class="error-text">{{ error() }}</p>
        }
        <button type="submit" class="button button--full">Send reset instructions</button>
        <a routerLink="/auth/login">Back to login</a>
      </form>
    </section>
  `
})
export class ForgotPasswordPageComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  readonly error = signal('');
  readonly message = signal('');
  readonly form = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]]
  });

  async submit(): Promise<void> {
    this.error.set('');
    this.message.set('');

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    try {
      await this.authService.forgotPassword(this.form.getRawValue().email);
      this.message.set('If the account exists, reset instructions have been sent.');
    } catch {
      this.error.set('Unable to request a password reset.');
    }
  }
}
