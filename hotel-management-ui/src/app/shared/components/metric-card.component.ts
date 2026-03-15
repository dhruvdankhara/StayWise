import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-metric-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article
      class="surface p-6 rounded-[2rem] bg-white border border-black/5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col items-start h-full group"
    >
      <div
        class="absolute -top-10 -right-10 w-24 h-24 bg-amber-500/10 blur-[20px] rounded-full group-hover:bg-amber-500/20 transition-colors"
      ></div>

      <div
        class="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4 border border-amber-900/10 shrink-0"
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
          <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
        </svg>
      </div>

      <p class="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1">{{ label() }}</p>
      <h3 class="text-3xl font-bold tracking-tight text-neutral-900 mb-2">{{ value() }}</h3>

      <div class="mt-auto pt-4 border-t border-black/5 w-full">
        <p class="text-xs font-medium text-neutral-500 flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 opacity-70"></span>
          {{ change() }}
        </p>
      </div>
    </article>
  `,
})
export class MetricCardComponent {
  readonly label = input.required<string>();
  readonly value = input.required<string>();
  readonly change = input.required<string>();
}
