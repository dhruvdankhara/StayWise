import { AsyncPipe, CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom, map, switchMap } from 'rxjs';

import { BillingService } from '../../core/services/billing.service';
import { BookingService } from '../../core/services/booking.service';
import { ReviewService } from '../../core/services/review.service';

@Component({
  selector: 'app-guest-booking-detail-page',
  imports: [AsyncPipe, CurrencyPipe, DatePipe, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="animate-fade-in pb-20 pt-6 text-left relative overflow-hidden min-h-screen">
      <!-- Ambient Background -->
      <div class="fixed inset-0 -z-10 pointer-events-none bg-neutral-50/50">
        <div
          class="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-amber-500/10 blur-[120px]"
        ></div>
        <div
          class="absolute top-[20%] right-[5%] w-[40%] h-[40%] rounded-full bg-orange-500/10 blur-[100px]"
        ></div>
        <div
          class="absolute -bottom-[10%] left-[20%] w-[60%] h-[50%] rounded-full bg-rose-500/10 blur-[120px]"
        ></div>
      </div>

      @if (booking$ | async; as booking) {
        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <!-- Header Card -->
          <header
            class="mb-8 relative flex flex-col md:flex-row md:items-end justify-between gap-6 rounded-[2.5rem] border border-white/60 bg-white/70 backdrop-blur-2xl p-6 md:p-10 shadow-xl shadow-amber-900/5"
          >
            <div>
              <div
                class="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-amber-100/80 border border-amber-200/50 mb-6 shadow-sm"
              >
                <span class="relative flex h-2.5 w-2.5">
                  <span
                    class="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"
                  ></span>
                  <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                </span>
                <span class="text-xs font-bold text-amber-800 tracking-wide uppercase"
                  >Booking Detail</span
                >
              </div>
              <h1
                class="text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-900 flex items-center gap-4"
              >
                Ref:
                <span
                  class="text-amber-600 font-mono bg-amber-50/50 px-4 py-1 rounded-2xl border border-amber-100/50"
                  >{{ booking.bookingRef }}</span
                >
              </h1>
            </div>

            <div class="flex flex-wrap gap-3 md:justify-end">
              <span
                class="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-neutral-200 text-neutral-700 text-sm font-bold uppercase tracking-wider rounded-xl shadow-sm transition-colors"
                [class.bg-emerald-50]="isValue(booking.status, 'confirmed')"
                [class.text-emerald-700]="isValue(booking.status, 'confirmed')"
                [class.border-emerald-200]="isValue(booking.status, 'confirmed')"
              >
                <span
                  class="w-2 h-2 rounded-full bg-neutral-400"
                  [class.bg-emerald-500]="isValue(booking.status, 'confirmed')"
                ></span>
                {{ asLabel(booking.status) }}
              </span>
              <span
                class="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-neutral-200 text-neutral-700 text-sm font-bold uppercase tracking-wider rounded-xl shadow-sm transition-colors"
                [class.bg-emerald-50]="isValue(booking.paymentStatus, 'paid')"
                [class.text-emerald-700]="isValue(booking.paymentStatus, 'paid')"
                [class.border-emerald-200]="isValue(booking.paymentStatus, 'paid')"
              >
                <span
                  class="w-2 h-2 rounded-full bg-neutral-400"
                  [class.bg-emerald-500]="isValue(booking.paymentStatus, 'paid')"
                ></span>
                {{ asLabel(booking.paymentStatus) }} Payment
              </span>
            </div>
          </header>

          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
            <!-- Main Details Content -->
            <div class="lg:col-span-8 space-y-8">
              <article
                class="relative border border-white/80 shadow-2xl shadow-amber-900/5 rounded-[2.5rem] p-6 md:p-10 backdrop-blur-2xl bg-white/80 overflow-hidden group"
              >
                <div
                  class="absolute -top-32 -right-32 w-80 h-80 bg-amber-500/10 rounded-full blur-[80px] z-0 transition-transform duration-700 group-hover:scale-110"
                ></div>

                <div class="relative z-10">
                  <div
                    class="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-10 border-b border-neutral-200/60"
                  >
                    <div class="flex items-start md:items-center gap-6">
                      <div
                        class="w-20 h-20 rounded-3xl bg-linear-to-br from-amber-100 to-orange-50 border border-amber-200/50 flex items-center justify-center text-amber-700 shrink-0 shadow-inner"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="36"
                          height="36"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <path d="M2 22h20"></path>
                          <path d="M4 2v20"></path>
                          <path d="M20 2v20"></path>
                          <path d="M10 22V8a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v14"></path>
                          <path d="M14 12V2h-4v10"></path>
                        </svg>
                      </div>
                      <div>
                        <p
                          class="text-xs font-bold text-neutral-400 mb-1.5 uppercase tracking-widest"
                        >
                          Room Assigned
                        </p>
                        <h2 class="text-3xl font-extrabold text-neutral-900 mb-2">
                          {{ booking.room?.type || 'Standard Room' }}
                        </h2>
                        <div class="flex flex-wrap items-center gap-3">
                          <p
                            class="inline-flex text-neutral-700 font-semibold items-center gap-1.5 bg-white px-3 py-1 rounded-lg border border-neutral-200/60 shadow-sm"
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
                              class="text-amber-600"
                            >
                              <path
                                d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                              ></path>
                              <polyline points="22,6 12,13 2,6"></polyline>
                            </svg>
                            Room {{ booking.room?.roomNumber || 'TBD' }}
                          </p>
                          <p
                            class="inline-flex text-neutral-700 font-semibold items-center gap-1.5 bg-white px-3 py-1 rounded-lg border border-neutral-200/60 shadow-sm"
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
                              class="text-amber-600"
                            >
                              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                              <circle cx="9" cy="7" r="4"></circle>
                              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                            </svg>
                            {{ booking.guests }} Guest{{ booking.guests > 1 ? 's' : '' }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    class="grid grid-cols-1 md:grid-cols-2 gap-6 py-10 border-b border-neutral-200/60"
                  >
                    <div
                      class="bg-linear-to-br from-orange-50/50 to-amber-50/30 border border-orange-100 rounded-4xl p-6 transition-all hover:shadow-md hover:border-orange-200"
                    >
                      <div class="flex items-center gap-4 mb-4">
                        <div
                          class="w-12 h-12 rounded-xl bg-white border border-orange-100 flex items-center justify-center text-orange-600 shadow-sm"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          >
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                          </svg>
                        </div>
                        <p class="text-sm font-bold text-neutral-500 uppercase tracking-widest">
                          Stay Period
                        </p>
                      </div>
                      <div class="space-y-4 pl-2 border-l-2 border-orange-200/50 ml-6">
                        <div class="relative">
                          <span
                            class="absolute -left-2.75 top-2 w-2 h-2 rounded-full bg-orange-400"
                          ></span>
                          <p
                            class="text-xs text-neutral-500 font-bold uppercase tracking-wider mb-1"
                          >
                            Check-in
                          </p>
                          <p class="text-lg text-neutral-900 font-extrabold">
                            {{ booking.checkIn | date: 'mediumDate' }}
                          </p>
                        </div>
                        <div class="relative pt-2">
                          <span
                            class="absolute -left-2.75 top-4 w-2 h-2 rounded-full bg-orange-400"
                          ></span>
                          <p
                            class="text-xs text-neutral-500 font-bold uppercase tracking-wider mb-1"
                          >
                            Check-out
                          </p>
                          <p class="text-lg text-neutral-900 font-extrabold">
                            {{ booking.checkOut | date: 'mediumDate' }}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div
                      class="bg-linear-to-br from-emerald-50/50 to-teal-50/30 border border-emerald-100 rounded-4xl p-6 flex flex-col justify-between transition-all hover:shadow-md hover:border-emerald-200"
                    >
                      <div class="flex items-center gap-4 mb-4">
                        <div
                          class="w-12 h-12 rounded-xl bg-white border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          >
                            <line x1="12" y1="1" x2="12" y2="23"></line>
                            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                          </svg>
                        </div>
                        <p class="text-sm font-bold text-neutral-500 uppercase tracking-widest">
                          Total Amount
                        </p>
                      </div>
                      <div class="ml-2">
                        <p
                          class="text-4xl text-neutral-900 font-black tracking-tight drop-shadow-sm"
                        >
                          {{ booking.totalAmount | currency: 'INR' : 'symbol' : '1.0-0' }}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div class="pt-10">
                    <h3 class="text-xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="text-amber-600"
                      >
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                      </svg>
                      Booking Information
                    </h3>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <!-- Info Cards -->
                      <div
                        class="bg-white/50 border border-neutral-200/60 rounded-2xl p-5 flex flex-col justify-center transition-colors hover:bg-white"
                      >
                        <span
                          class="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1"
                          >Guest Name</span
                        >
                        <span class="text-neutral-800 font-bold truncate text-lg">{{
                          booking.guest?.name || 'Guest'
                        }}</span>
                      </div>
                      <div
                        class="bg-white/50 border border-neutral-200/60 rounded-2xl p-5 flex flex-col justify-center transition-colors hover:bg-white"
                      >
                        <span
                          class="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1"
                          >Email Address</span
                        >
                        <span class="text-neutral-800 font-bold truncate text-lg">{{
                          booking.guest?.email || '-'
                        }}</span>
                      </div>
                      <div
                        class="bg-white/50 border border-neutral-200/60 rounded-2xl p-5 flex flex-col justify-center transition-colors hover:bg-white"
                      >
                        <span
                          class="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1"
                          >Payment Method</span
                        >
                        <span class="text-neutral-800 font-bold truncate text-lg">{{
                          asLabel(booking.paymentMethod || '-')
                        }}</span>
                      </div>
                      <div
                        class="bg-white/50 border border-neutral-200/60 rounded-2xl p-5 flex flex-col justify-center transition-colors hover:bg-white"
                      >
                        <span
                          class="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1"
                          >Booking ID</span
                        >
                        <span class="text-neutral-600 font-bold truncate font-mono text-sm">{{
                          booking.id || '-'
                        }}</span>
                      </div>
                      <div
                        class="sm:col-span-2 bg-amber-50/30 border border-amber-100 rounded-2xl p-5 flex flex-col justify-center transition-colors hover:bg-amber-50/60"
                      >
                        <span
                          class="text-xs font-bold text-amber-600/70 uppercase tracking-wider mb-1"
                          >Special Requests</span
                        >
                        <span class="text-neutral-800 font-semibold whitespace-pre-wrap">{{
                          booking.specialRequests || 'No special requests submitted.'
                        }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </div>

            <!-- Sidebar Actions & Review -->
            <aside class="lg:col-span-4 flex flex-col gap-6 relative z-10 top-24">
              <!-- Action Buttons -->
              <div class="grid grid-cols-1 gap-4">
                <button
                  type="button"
                  class="flex items-center justify-between px-6 py-4 rounded-3xl bg-white border border-neutral-200/80 hover:border-amber-300 hover:bg-amber-50 hover:ring-4 hover:ring-amber-500/10 text-neutral-800 hover:text-amber-900 font-bold transition-all shadow-lg shadow-neutral-200/20 group"
                  (click)="downloadInvoice(booking.id)"
                >
                  <span class="flex items-center gap-3">
                    <span
                      class="p-2 bg-neutral-100 text-neutral-600 rounded-lg group-hover:bg-amber-100 group-hover:text-amber-600 transition-colors"
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
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                      </svg>
                    </span>
                    Download Invoice
                  </span>
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
                    class="text-neutral-400 group-hover:text-amber-500 group-hover:translate-x-1 transition-all"
                  >
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>
                <!--  <button
                  type="button"
                  class="flex items-center justify-between px-6 py-4 rounded-3xl bg-white border border-neutral-200/80 hover:border-red-300 hover:bg-red-50 hover:ring-4 hover:ring-red-500/10 text-neutral-800 hover:text-red-700 font-bold transition-all shadow-lg shadow-neutral-200/20 group"
                  (click)="cancel(booking.id)"
                >
                  <span class="flex items-center gap-3">
                    <span class="p-2 bg-neutral-100 text-neutral-600 rounded-lg group-hover:bg-red-100 group-hover:text-red-600 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="group-hover:rotate-90 transition-transform duration-300"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </span>
                    Cancel Booking
                  </span>
                </button> -->
              </div>

              <!-- Review Form -->
              <form
                class="border border-white/60 shadow-2xl shadow-amber-900/10 rounded-4xl p-6 lg:p-8 backdrop-blur-2xl bg-linear-to-br from-white/90 via-white/80 to-amber-50/90 flex flex-col gap-6 relative overflow-hidden"
                [formGroup]="reviewForm"
                (ngSubmit)="submitReview(booking.id, booking.room?.id || '')"
              >
                <div
                  class="absolute -right-10 -top-10 text-amber-500/5 rotate-12 pointer-events-none"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="160"
                    height="160"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <polygon
                      points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                    ></polygon>
                  </svg>
                </div>

                <div class="flex items-center gap-4 mb-2 relative z-10">
                  <div
                    class="w-14 h-14 rounded-2xl bg-linear-to-br from-amber-400 to-orange-500 shadow-md shadow-amber-500/20 flex items-center justify-center text-white shrink-0"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      stroke="currentColor"
                      stroke-width="1"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <polygon
                        points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                      ></polygon>
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-xl font-extrabold text-neutral-900 leading-tight">
                      Leave a Review
                    </h3>
                    <p class="text-sm font-medium text-amber-700/80">Share your experience</p>
                  </div>
                </div>

                <div class="space-y-5 relative z-10">
                  <label class="flex flex-col gap-2.5">
                    <span class="text-sm font-bold text-neutral-700">Rating Snapshot (1-5)</span>
                    <div class="relative">
                      <input
                        type="number"
                        min="1"
                        max="5"
                        formControlName="rating"
                        class="w-full pl-5 pr-12 py-3.5 rounded-xl border border-neutral-200/80 bg-white/50 shadow-inner focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-400 focus:bg-white transition-all text-neutral-900 font-bold text-lg"
                      />
                      <div
                        class="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-amber-500 fill-current"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          stroke="currentColor"
                          stroke-width="1"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <polygon
                            points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                          ></polygon>
                        </svg>
                      </div>
                    </div>
                  </label>

                  <label class="flex flex-col gap-2.5">
                    <span class="text-sm font-bold text-neutral-700">Your comments</span>
                    <textarea
                      formControlName="comment"
                      rows="4"
                      class="w-full px-5 py-4 rounded-xl border border-neutral-200/80 bg-white/50 shadow-inner focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-400 focus:bg-white transition-all resize-none placeholder:text-neutral-400 font-medium text-neutral-800"
                      placeholder="How was the hospitality?"
                    ></textarea>
                  </label>
                </div>

                @if (message()) {
                  <div
                    class="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3 relative z-10"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="text-emerald-600 shrink-0 mt-0.5"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <p class="text-sm font-bold text-emerald-800 m-0">{{ message() }}</p>
                  </div>
                }

                @if (error()) {
                  <div
                    class="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 relative z-10"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="text-red-600 shrink-0 mt-0.5"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <p class="text-sm font-bold text-red-800 m-0">{{ error() }}</p>
                  </div>
                }

                <button
                  type="submit"
                  class="w-full relative z-10 shadow-lg shadow-amber-600/30 hover:shadow-xl hover:shadow-amber-600/40 hover:-translate-y-1 transition-all duration-300 py-4 mt-2 rounded-xl flex items-center justify-center gap-3 text-white font-bold text-lg bg-linear-to-r from-amber-600 via-orange-600 to-amber-700 border-0 overflow-hidden group"
                >
                  <span
                    class="absolute inset-0 w-full h-full -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent group-hover:animate-shimmer"
                  ></span>
                  <span class="relative">Submit Review</span>
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
                    class="relative group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                  >
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </button>
              </form>
            </aside>
          </div>
        </section>
      }
    </div>
  `,
})
export class GuestBookingDetailPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly formBuilder = inject(FormBuilder);
  private readonly bookingService = inject(BookingService);
  private readonly billingService = inject(BillingService);
  private readonly reviewService = inject(ReviewService);

  readonly error = signal('');
  readonly message = signal('');
  readonly reviewForm = this.formBuilder.nonNullable.group({
    rating: 5,
    comment: '',
  });
  readonly booking$ = this.route.paramMap.pipe(
    map((params) => params.get('id') ?? ''),
    switchMap((bookingId) => this.bookingService.getBooking(bookingId)),
  );

  isValue(value: string | undefined, target: string): boolean {
    return (value ?? '').trim().toLowerCase() === target.toLowerCase();
  }

  asLabel(value: string | undefined): string {
    const cleaned = (value ?? '').replace(/[_-]+/g, ' ').trim().toLowerCase();
    if (!cleaned) {
      return '-';
    }

    return cleaned.replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  async cancel(bookingId: string): Promise<void> {
    this.message.set('');
    this.error.set('');
    try {
      await firstValueFrom(
        this.bookingService.cancelBooking(bookingId, 'Cancelled by guest from self-service portal'),
      );
      this.message.set('Booking cancelled successfully.');
    } catch {
      this.error.set('Unable to cancel this booking.');
    }
  }

  async downloadInvoice(bookingId: string): Promise<void> {
    try {
      const blob = await firstValueFrom(this.billingService.downloadInvoicePdf(bookingId));
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank', 'noopener');
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      this.error.set('Unable to download the invoice.');
    }
  }

  async submitReview(bookingId: string, roomId: string): Promise<void> {
    this.message.set('');
    this.error.set('');
    try {
      await firstValueFrom(
        this.reviewService.submitReview({
          bookingId,
          roomId,
          ...this.reviewForm.getRawValue(),
        }),
      );
      this.message.set('Review submitted successfully.');
    } catch {
      this.error.set('Review submission is only available after checkout.');
    }
  }
}
