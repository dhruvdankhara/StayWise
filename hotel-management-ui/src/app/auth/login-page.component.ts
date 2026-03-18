import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { dashboardRouteByRole } from '../core/models/navigation';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="animate-fade-in min-h-[80vh] flex items-center justify-center py-12">
      <section
        class="container max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center"
      >
        <div class="auth-copy space-y-8 z-10">
          <div>
            <div
              class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-950/5 border border-orange-900/10 mb-4"
            >
              <span class="w-2 h-2 rounded-full bg-amber-600 animate-pulse"></span>
              <p class="eyebrow m-0! text-xs! text-amber-800">Welcome Back</p>
            </div>
            <h1
              class="text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 leading-[1.1]"
            >
              Sign in to <span class="text-amber-700">StayWise</span>
            </h1>
            <p class="mt-4 text-lg text-neutral-600 leading-relaxed max-w-lg">
              Access the public booking flow or your role-based operations panel with a live
              API-backed session.
            </p>
          </div>

          <div
            class="surface relative border border-amber-900/10 shadow-lg rounded-3xl p-6 backdrop-blur-xl bg-orange-50/60 transition-transform hover:-translate-y-1 duration-300"
          >
            <div class="flex items-center gap-3 mb-4">
              <div
                class="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-800"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <p class="eyebrow m-0! text-amber-900">Seeded Demo Accounts</p>
            </div>
            <div class="flex flex-wrap gap-2 text-sm">
              <code
                class="px-2.5 py-1.5 rounded-lg bg-white border border-amber-900/10 text-amber-900 font-medium whitespace-nowrap"
                >admin@staywise.com</code
              >
              <code
                class="px-2.5 py-1.5 rounded-lg bg-white border border-amber-900/10 text-amber-900 font-medium whitespace-nowrap"
                >reception@staywise.com</code
              >
              <code
                class="px-2.5 py-1.5 rounded-lg bg-white border border-amber-900/10 text-amber-900 font-medium whitespace-nowrap"
                >cleaning@staywise.com</code
              >
              <code
                class="px-2.5 py-1.5 rounded-lg bg-white border border-amber-900/10 text-amber-900 font-medium whitespace-nowrap"
                >guest@staywise.com</code
              >
            </div>
            <p class="text-xs text-amber-800/70 mt-3 flex items-center gap-1.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              Password for all seeded accounts is <strong class="font-bold">Password@123</strong>
            </p>
          </div>
        </div>

        <div class="relative w-full max-w-md mx-auto lg:ml-auto">
          <div
            class="absolute -top-10 -right-10 w-72 h-72 bg-amber-600/20 rounded-full blur-[80px] z-0"
          ></div>

          <form
            class="surface relative z-10 border border-white/60 shadow-2xl rounded-4xl p-8 backdrop-blur-xl bg-white/80 flex flex-col gap-6"
            [formGroup]="form"
            (ngSubmit)="submit()"
          >
            <div class="text-center mb-2">
              <h2 class="text-3xl font-bold text-neutral-900">Sign in</h2>
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

            <label class="flex flex-col gap-2">
              <div class="flex items-center justify-between">
                <span class="text-sm font-semibold text-neutral-700">Password</span>
                <a
                  routerLink="/auth/forgot-password"
                  class="text-xs font-semibold text-amber-700 hover:text-amber-900 transition-colors"
                  >Forgot password?</a
                >
              </div>
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
              Continue
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
                Need an account?
                <a
                  routerLink="/auth/register"
                  class="font-semibold text-amber-700 hover:text-amber-900 transition-colors ml-1"
                  >Register as a guest</a
                >
              </p>
            </div>
          </form>
        </div>
      </section>
    </div>
  `,
})
export class LoginPageComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly error = signal('');
  readonly form = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
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

    const returnUrl = this.route.snapshot.queryParams['returnUrl'];
    const role = this.authService.user()?.role;
    await this.router.navigateByUrl(returnUrl || (role ? dashboardRouteByRole[role] : '/guest'));
  }
}
