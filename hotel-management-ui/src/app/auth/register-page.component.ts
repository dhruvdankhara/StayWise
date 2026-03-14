import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../core/services/auth.service';
import { BrandMarkComponent } from '../shared/components/brand-mark.component';

@Component({
  selector: 'app-register-page',
  imports: [ReactiveFormsModule, RouterLink, BrandMarkComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="auth-shell container">
      <div class="auth-copy">
        <app-brand-mark />
        <h1>Create your guest account</h1>
        <p>Create a live guest account, verify your email, and continue into the booking journey.</p>
      </div>
      <form class="surface auth-form" [formGroup]="form" (ngSubmit)="submit()">
        <label>
          <span>Full name</span>
          <input type="text" formControlName="name" placeholder="Ishita Verma" />
        </label>
        <label>
          <span>Email</span>
          <input type="email" formControlName="email" placeholder="you@example.com" />
        </label>
        <label>
          <span>Phone</span>
          <input type="tel" formControlName="phone" placeholder="9876500005" />
        </label>
        <label>
          <span>Password</span>
          <input type="password" formControlName="password" placeholder="Minimum 8 characters" />
        </label>
        @if (error()) {
          <p class="error-text">{{ error() }}</p>
        }
        <button type="submit" class="button button--full">Create account</button>
        <a routerLink="/auth/login">Already registered? Sign in</a>
      </form>
    </section>
  `
})
export class RegisterPageComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  readonly error = signal('');
  readonly form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.minLength(8)]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  async submit(): Promise<void> {
    this.error.set('');

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    try {
      await this.authService.register(this.form.getRawValue());
    } catch {
      this.error.set('Unable to create the account right now.');
      return;
    }

    await this.router.navigateByUrl('/guest');
  }
}
