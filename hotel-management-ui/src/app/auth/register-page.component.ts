import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-register-page',
  imports: [ReactiveFormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="animate-fade-in min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
    >
      <section
        class="container max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center"
      >
        <div class="auth-copy space-y-8 z-10">
          <div>
            <div
              class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-950/5 border border-orange-900/10 mb-4"
            >
              <span class="w-2 h-2 rounded-full bg-amber-600 animate-pulse"></span>
              <p class="eyebrow m-0! text-xs! text-amber-800">New Guest</p>
            </div>
            <h1
              class="text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 leading-[1.1]"
            >
              Create your <br /><span class="text-amber-700">Guest Account</span>
            </h1>
            <p class="mt-4 text-lg text-neutral-600 leading-relaxed max-w-lg">
              Create a live guest account, verify your email, and continue into the booking journey.
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
            class="surface relative z-10 border border-white/60 shadow-2xl rounded-4xl p-8 backdrop-blur-xl bg-white/80 flex flex-col gap-5"
            [formGroup]="form"
            (ngSubmit)="submit()"
          >
            <div class="text-center mb-2">
              <h2 class="text-2xl font-bold text-neutral-900">Register</h2>
              <p class="text-neutral-500 mt-1">Fill in the details to get started</p>
            </div>

            <label class="flex flex-col gap-2">
              <span class="text-sm font-semibold text-neutral-700">Full name</span>
              <div class="relative">
                <input
                  type="text"
                  formControlName="name"
                  placeholder="Ishita Verma"
                  class="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200 bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all placeholder:text-neutral-400"
                />
              </div>
            </label>

            <label class="flex flex-col gap-2">
              <span class="text-sm font-semibold text-neutral-700">Email</span>
              <div class="relative">
                <input
                  type="email"
                  formControlName="email"
                  placeholder="you@example.com"
                  class="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200 bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all placeholder:text-neutral-400"
                />
              </div>
            </label>

            <label class="flex flex-col gap-2">
              <span class="text-sm font-semibold text-neutral-700">Phone</span>
              <div class="relative">
                <input
                  type="tel"
                  formControlName="phone"
                  placeholder="9876500005"
                  class="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200 bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all placeholder:text-neutral-400"
                />
              </div>
            </label>

            <label class="flex flex-col gap-2">
              <span class="text-sm font-semibold text-neutral-700">Password</span>
              <div class="relative">
                <input
                  type="password"
                  formControlName="password"
                  placeholder="••••••••"
                  class="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200 bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all placeholder:text-neutral-400"
                />
              </div>
            </label>

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
              Create account
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
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>

            <div class="text-center mt-2 border-t border-black/5 pt-6">
              <p class="text-sm text-neutral-600">
                Already registered?
                <a
                  routerLink="/auth/login"
                  class="font-semibold text-amber-700 hover:text-amber-900 transition-colors ml-1"
                  >Sign in</a
                >
              </p>
            </div>
          </form>
        </div>
      </section>
    </div>
  `,
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
    password: ['', [Validators.required, Validators.minLength(8)]],
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
