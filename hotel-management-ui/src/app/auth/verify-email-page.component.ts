import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { AuthService } from '../core/services/auth.service';
import { BrandMarkComponent } from '../shared/components/brand-mark.component';

@Component({
  selector: 'app-verify-email-page',
  imports: [ReactiveFormsModule, RouterLink, BrandMarkComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="auth-shell container">
      <div class="auth-copy">
        <app-brand-mark />
        <h1>Verify your email</h1>
        <p>Confirm the account token received during registration.</p>
      </div>
      <form class="surface auth-form" [formGroup]="form" (ngSubmit)="submit()">
        <label>
          <span>Verification token</span>
          <input type="text" formControlName="token" />
        </label>
        @if (message()) {
          <p>{{ message() }}</p>
        }
        @if (error()) {
          <p class="error-text">{{ error() }}</p>
        }
        <button type="submit" class="button button--full">Verify account</button>
        <a routerLink="/auth/login">Back to login</a>
      </form>
    </section>
  `
})
export class VerifyEmailPageComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);
  readonly error = signal('');
  readonly message = signal('');
  readonly form = this.formBuilder.nonNullable.group({
    token: [this.route.snapshot.queryParamMap.get('token') ?? '', [Validators.required]]
  });

  async submit(): Promise<void> {
    this.error.set('');
    this.message.set('');

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    try {
      await this.authService.verifyEmail(this.form.getRawValue().token);
      this.message.set('Email verified successfully.');
    } catch {
      this.error.set('Unable to verify this token.');
    }
  }
}
