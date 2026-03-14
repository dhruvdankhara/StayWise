import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../core/services/auth.service';
import { BrandMarkComponent } from '../shared/components/brand-mark.component';

@Component({
  selector: 'app-reset-password-page',
  imports: [ReactiveFormsModule, BrandMarkComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="auth-shell container">
      <div class="auth-copy">
        <app-brand-mark />
        <h1>Choose a new password</h1>
        <p>Use the token from your email to complete the reset flow.</p>
      </div>
      <form class="surface auth-form" [formGroup]="form" (ngSubmit)="submit()">
        <label>
          <span>Reset token</span>
          <input type="text" formControlName="token" placeholder="Paste verification token" />
        </label>
        <label>
          <span>New password</span>
          <input type="password" formControlName="password" />
        </label>
        @if (message()) {
          <p>{{ message() }}</p>
        }
        @if (error()) {
          <p class="error-text">{{ error() }}</p>
        }
        <button type="submit" class="button button--full">Update password</button>
      </form>
    </section>
  `
})
export class ResetPasswordPageComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  readonly error = signal('');
  readonly message = signal('');
  readonly form = this.formBuilder.nonNullable.group({
    token: [this.route.snapshot.queryParamMap.get('token') ?? '', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  async submit(): Promise<void> {
    this.error.set('');
    this.message.set('');

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { token, password } = this.form.getRawValue();

    try {
      await this.authService.resetPassword(token, password);
      this.message.set('Password updated successfully. Redirecting to login.');
      setTimeout(() => void this.router.navigateByUrl('/auth/login'), 800);
    } catch {
      this.error.set('Unable to reset the password.');
    }
  }
}
