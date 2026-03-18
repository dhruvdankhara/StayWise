import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

import { SettingsService } from '../../core/services/settings.service';

@Component({
  selector: 'app-admin-settings-page',
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="animate-fade-in relative z-10 max-w-[1200px] mx-auto pb-12">
      <!-- Header -->
      <section class="mb-8 lg:mb-12">
        <p
          class="text-sm font-bold text-amber-700 uppercase tracking-widest mb-3 flex items-center gap-2"
        >
          <span class="w-2 h-2 rounded-full bg-amber-500"></span>
          System Configuration
        </p>
        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900 mb-4">
          Hotel Settings
        </h1>
        <p class="text-lg text-neutral-600 max-w-2xl leading-relaxed">
          Manage your hotel's profile, contact details, and invoice configurations globally.
        </p>
      </section>

      <!-- Main Action Grid -->
      <form
        class="surface bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-black/5 shadow-sm p-6 sm:p-10 relative overflow-hidden"
        [formGroup]="form"
        (ngSubmit)="save()"
      >
        <div
          class="absolute -top-32 -right-32 w-96 h-96 bg-amber-500/10 blur-[60px] rounded-full pointer-events-none"
        ></div>
        <div
          class="absolute -bottom-32 -left-32 w-64 h-64 bg-amber-500/10 blur-[40px] rounded-full pointer-events-none"
        ></div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 relative z-10">
          <!-- Column 1: General Info -->
          <div class="flex flex-col gap-6">
            <div class="flex items-center gap-3 mb-2 border-b border-black/5 pb-4">
              <div
                class="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-900/10"
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
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
              </div>
              <h3 class="text-lg font-bold text-neutral-900 m-0">Identity & Contact</h3>
            </div>

            <label class="flex flex-col gap-1.5">
              <span class="text-xs font-semibold text-neutral-700 uppercase tracking-wide"
                >Hotel Property Name</span
              >
              <input
                type="text"
                formControlName="name"
                class="w-full px-4 py-3 bg-neutral-50 border border-black/5 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-sm outline-none font-medium"
              />
            </label>

            <label class="flex flex-col gap-1.5">
              <span class="text-xs font-semibold text-neutral-700 uppercase tracking-wide"
                >Physical Address</span
              >
              <input
                type="text"
                formControlName="address"
                class="w-full px-4 py-3 bg-neutral-50 border border-black/5 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-sm outline-none"
              />
            </label>

            <div class="grid grid-cols-2 gap-4">
              <label class="flex flex-col gap-1.5">
                <span class="text-xs font-semibold text-neutral-700 uppercase tracking-wide"
                  >Contact Email</span
                >
                <input
                  type="email"
                  formControlName="contactEmail"
                  class="w-full px-4 py-3 bg-neutral-50 border border-black/5 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-sm outline-none"
                />
              </label>
              <label class="flex flex-col gap-1.5">
                <span class="text-xs font-semibold text-neutral-700 uppercase tracking-wide"
                  >Contact Phone</span
                >
                <input
                  type="tel"
                  formControlName="contactPhone"
                  class="w-full px-4 py-3 bg-neutral-50 border border-black/5 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-sm outline-none"
                />
              </label>
            </div>

            <!-- <label class="flex flex-col gap-1.5">
              <span class="text-xs font-semibold text-neutral-700 uppercase tracking-wide"
                >Brand Logo URL</span
              >
              <input
                type="url"
                formControlName="logoUrl"
                placeholder="https://..."
                class="w-full px-4 py-3 bg-neutral-50 border border-black/5 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-sm outline-none text-neutral-500"
              />
            </label> -->
          </div>

          <!-- Column 2: Operations -->
          <div class="flex flex-col gap-6">
            <div class="flex items-center gap-3 mb-2 border-b border-black/5 pb-4">
              <div
                class="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-900/10"
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
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <h3 class="text-lg font-bold text-neutral-900 m-0">Finance & Timings</h3>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <label class="flex flex-col gap-1.5">
                <span class="text-xs font-semibold text-neutral-700 uppercase tracking-wide"
                  >Base Currency</span
                >
                <input
                  type="text"
                  formControlName="currency"
                  class="w-full px-4 py-3 bg-neutral-50 border border-black/5 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-sm outline-none uppercase font-bold text-neutral-900"
                />
              </label>
            </div>

            <label class="flex flex-col gap-1.5">
              <span class="text-xs font-semibold text-neutral-700 uppercase tracking-wide"
                >Invoice Footer Terms</span
              >
              <textarea
                formControlName="invoiceFooter"
                rows="2"
                class="w-full px-4 py-3 bg-neutral-50 border border-black/5 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-sm outline-none resize-none"
              ></textarea>
            </label>

            <div class="grid grid-cols-2 gap-4 mt-auto">
              <label class="flex flex-col gap-1.5">
                <span class="text-xs font-semibold text-neutral-700 uppercase tracking-wide"
                  >Check-in Time</span
                >
                <input
                  type="time"
                  formControlName="checkInTime"
                  class="w-full px-4 py-3 bg-neutral-50 border border-black/5 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-sm outline-none"
                />
              </label>
              <label class="flex flex-col gap-1.5">
                <span class="text-xs font-semibold text-neutral-700 uppercase tracking-wide"
                  >Check-out Time</span
                >
                <input
                  type="time"
                  formControlName="checkOutTime"
                  class="w-full px-4 py-3 bg-neutral-50 border border-black/5 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-sm outline-none"
                />
              </label>
            </div>
          </div>
        </div>

        @if (message() || error()) {
          <div class="mt-8 pt-6 border-t border-black/5">
            @if (message()) {
              <div
                class="p-4 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center gap-3 animate-fade-in relative z-10"
              >
                <div
                  class="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <p class="text-sm font-medium text-emerald-800 m-0">{{ message() }}</p>
              </div>
            }
            @if (error()) {
              <div
                class="p-4 rounded-xl bg-red-50 border border-red-100 flex items-center gap-3 animate-fade-in relative z-10"
              >
                <div
                  class="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                </div>
                <p class="text-sm font-medium text-red-800 m-0">{{ error() }}</p>
              </div>
            }
          </div>
        }

        <div class="mt-8 pt-6 border-t border-black/5 flex justify-end gap-4 relative z-10">
          <button
            type="submit"
            class="button w-full sm:w-auto px-10 py-3 text-base justify-center bg-amber-800 hover:bg-amber-900 border-0 shadow-lg shadow-amber-900/20 text-white rounded-xl transition-transform hover:-translate-y-0.5"
          >
            Save System Configurations
          </button>
        </div>
      </form>
    </div>
  `,
})
export class AdminSettingsPageComponent {
  private readonly settingsService = inject(SettingsService);
  private readonly formBuilder = inject(FormBuilder);
  readonly message = signal('');
  readonly error = signal('');
  readonly form = this.formBuilder.nonNullable.group({
    name: ['', Validators.required],
    address: ['', Validators.required],
    contactEmail: ['', [Validators.required, Validators.email]],
    contactPhone: ['', Validators.required],
    logoUrl: [''],
    invoiceFooter: [''],

    currency: ['INR', Validators.required],
    checkInTime: ['14:00', Validators.required],
    checkOutTime: ['11:00', Validators.required],
  });

  constructor() {
    this.settingsService.getSettings().subscribe((settings) => {
      this.form.patchValue(settings);
    });
  }

  async save(): Promise<void> {
    this.message.set('');
    this.error.set('');
    try {
      await firstValueFrom(this.settingsService.updateSettings(this.form.getRawValue()));
      this.message.set('Settings saved successfully.');
    } catch {
      this.error.set('Unable to save settings.');
    }
  }
}
