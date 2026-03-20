import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-guest-profile-page',
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="animate-fade-in relative z-10 max-w-4xl mx-auto pb-12">
      <section class="mb-10">
        <p
          class="text-sm font-bold text-amber-700 uppercase tracking-widest mb-3 flex items-center gap-2"
        >
          <span class="w-2 h-2 rounded-full bg-amber-500"></span>
          Guest Profile
        </p>
        <h1 class="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 mb-4">
          Personal details & identity.
        </h1>
        <p class="text-lg text-neutral-600 max-w-2xl">
          Manage your personal information, contact methods, and preferences.
        </p>
      </section>

      <form
        class="surface bg-white/80 backdrop-blur-xl border border-white/60 shadow-xl rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden"
        [formGroup]="form"
        (ngSubmit)="submit()"
      >
        <!-- Ambient bubble -->
        <div
          class="absolute -top-32 -left-32 w-64 h-64 bg-amber-500/10 blur-2xl rounded-full pointer-events-none"
        ></div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
          <div class="md:col-span-2 flex items-center gap-6 pb-8 border-b border-black/5 mb-2">
            <div
              class="w-20 h-20 rounded-full bg-orange-50 border border-amber-900/10 flex items-center justify-center text-amber-800 text-2xl font-bold uppercase shadow-sm relative overflow-hidden"
            >
              @if (form.get('profileImage')?.value) {
                <img
                  [src]="form.get('profileImage')?.value"
                  alt="Profile"
                  class="w-full h-full object-cover"
                />
              } @else {
                {{ form.get('name')?.value?.charAt(0) || 'U' }}
              }
            </div>
            <div>
              <h3 class="text-xl font-bold text-neutral-900">
                {{ form.get('name')?.value || 'Guest User' }}
              </h3>
              <p class="text-sm text-neutral-500">Main Account Holder</p>
              <label
                class="mt-2 inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-amber-800 hover:text-amber-900"
              >
                <input
                  type="file"
                  accept="image/*"
                  class="hidden"
                  (change)="onProfileImageSelected($event)"
                  [disabled]="isUploadingImage()"
                />
                @if (isUploadingImage()) {
                  Uploading image...
                } @else {
                  Upload profile image
                }
              </label>
            </div>
          </div>

          <label class="flex flex-col gap-2">
            <span class="text-sm font-semibold text-neutral-700">Full Name</span>
            <div class="relative">
              <input
                type="text"
                formControlName="name"
                class="w-full pl-11 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-neutral-900 outline-none"
                placeholder="Your full name"
              />
            </div>
          </label>

          <label class="flex flex-col gap-2">
            <span class="text-sm font-semibold text-neutral-700">Phone Number</span>
            <div class="relative">
              <input
                type="tel"
                formControlName="phone"
                class="w-full pl-11 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-neutral-900 outline-none"
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </label>

          <!-- <label class="flex flex-col gap-2 md:col-span-2">
            <span class="text-sm font-semibold text-neutral-700">Profile Image URL</span>
            <div class="relative">
              <input
                type="url"
                formControlName="profileImage"
                class="w-full pl-11 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-neutral-900 outline-none"
                placeholder="https://example.com/avatar.jpg"
              />
            </div>
          </label> -->
        </div>

        @if (message()) {
          <div
            class="mt-6 p-4 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-100 flex items-center gap-3 animate-fade-in"
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
            <p class="text-sm font-medium m-0">{{ message() }}</p>
          </div>
        }
        @if (error()) {
          <div
            class="mt-6 p-4 rounded-2xl bg-red-50 text-red-800 border border-red-100 flex items-center gap-3 animate-fade-in"
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
            <p class="text-sm font-medium m-0">{{ error() }}</p>
          </div>
        }

        <div class="mt-10 pt-8 border-t border-black/5 flex justify-end">
          <button
            type="submit"
            [disabled]="form.invalid || isUploadingImage()"
            class="button py-3 px-8 text-base bg-amber-800 hover:bg-amber-900 text-white rounded-xl shadow-lg border-0 shadow-amber-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:-translate-y-0.5"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  `,
})
export class GuestProfilePageComponent {
  private readonly authService = inject(AuthService);
  private readonly formBuilder = inject(FormBuilder);
  readonly message = signal('');
  readonly error = signal('');
  readonly isUploadingImage = signal(false);
  readonly form = this.formBuilder.nonNullable.group({
    name: [this.authService.user()?.name ?? '', [Validators.required]],
    phone: [this.authService.user()?.phone ?? ''],
    profileImage: [this.authService.user()?.profileImage ?? ''],
  });

  async onProfileImageSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.message.set('');
      this.error.set('Please select an image up to 5MB.');
      input.value = '';
      return;
    }

    this.message.set('');
    this.error.set('');
    this.isUploadingImage.set(true);

    try {
      const user = await this.authService.uploadProfileImage(file);
      this.form.patchValue({ profileImage: user.profileImage ?? '' });
      this.message.set('Profile image uploaded successfully.');
    } catch {
      this.error.set('Unable to upload profile image.');
    } finally {
      this.isUploadingImage.set(false);
      input.value = '';
    }
  }

  async submit(): Promise<void> {
    this.message.set('');
    this.error.set('');
    try {
      const raw = this.form.getRawValue();
      const payload: { name: string; phone?: string; profileImage?: string } = {
        name: raw.name.trim(),
      };

      const phone = raw.phone.trim();
      if (phone) {
        payload.phone = phone;
      }

      const profileImage = raw.profileImage.trim();
      if (profileImage) {
        payload.profileImage = profileImage;
      }

      await this.authService.updateProfile(payload);
      this.message.set('Profile updated successfully.');
    } catch {
      this.error.set('Unable to update the profile.');
    }
  }
}
