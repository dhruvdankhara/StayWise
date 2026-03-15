import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-forgot-password-page',
  imports: [ReactiveFormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="animate-fade-in min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
    >
      <section
        class="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center"
      >
        <div class="auth-copy space-y-8 z-10">
          <div>
            <div
              class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-950/5 border border-orange-900/10 mb-4"
            >
              <span class="w-2 h-2 rounded-full bg-amber-600 animate-pulse"></span>
              <p class="eyebrow m-0! text-xs! text-amber-800">Account Recovery</p>
            </div>
            <h1
              class="text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 leading-[1.1]"
            >
              Reset your <br /><span class="text-amber-700">Access</span>
            </h1>
            <p class="mt-4 text-lg text-neutral-600 leading-relaxed max-w-lg">
              Request a password reset token that can be used on the reset-password screen to regain
              access to your account.
            </p>
          </div>
        </div>

        <div class="relative w-full max-w-md mx-auto lg:ml-auto">
          <div
            class="absolute -top-10 -right-10 w-72 h-72 bg-amber-600/20 rounded-full blur-[80px] z-0"
          ></div>
          <div
            class="absolute -bottom-10 -left-10 w-72 h-72 bg-orange-600/10 rounded-full blur-[80px] z-0"
          ></div>

          <form
            class="surface relative z-10 border border-white/60 shadow-2xl rounded-4xl p-8 backdrop-blur-xl bg-white/80 flex flex-col gap-6"
            [formGroup]="form"
            (ngSubmit)="submit()"
          >
            <div class="text-center mb-2">
              <h2 class="text-2xl font-bold text-neutral-900">Forgot Password?</h2>
              <p class="text-neutral-500 mt-1">We'll send you reset instructions</p>
            </div>

            <label class="flex flex-col gap-2">
              <span class="text-sm font-semibold text-neutral-700">Email</span>
              <div class="relative">
                <input
                  type="email"
                  formControlName="email"
                  placeholder="guest@staywise.com"
                  class="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200 bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all placeholder:text-neutral-400"
                />
              </div>
            </label>

            @if (message()) {
              <div
                class="p-3.5 rounded-xl bg-emerald-50 border border-emerald-100 flex items-start gap-3"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="text-emerald-600 shrink-0 mt-0.5"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <p class="text-sm font-medium text-emerald-800 m-0">{{ message() }}</p>
              </div>
            }

            @if (error()) {
              <div class="p-3.5 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="text-red-600 shrink-0 mt-0.5"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <p class="text-sm font-medium text-red-800 m-0">{{ error() }}</p>
              </div>
            }

            <button
              type="submit"
              class="button w-full shadow-lg shadow-amber-900/20 hover:scale-[1.02] transition-transform duration-200 py-3.5 mt-2 flex items-center justify-center gap-2 text-base"
            >
              Send reset instructions
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>

            <div class="text-center mt-2 border-t border-black/5 pt-6">
              <p class="text-sm text-neutral-600">
                Remember your password?
                <a
                  routerLink="/auth/login"
                  class="font-semibold text-amber-700 hover:text-amber-900 transition-colors ml-1"
                  >Back to login</a
                >
              </p>
            </div>
          </form>
        </div>
      </section>
    </div>
  `,
})
export class ForgotPasswordPageComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  readonly error = signal('');
  readonly message = signal('');
  readonly form = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
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
