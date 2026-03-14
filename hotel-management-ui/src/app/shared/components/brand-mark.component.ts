import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-brand-mark',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a routerLink="/" class="brand-mark" aria-label="StayWise home">
      <span class="brand-mark__icon">SW</span>
      <span>
        <strong>StayWise</strong>
        <small>Hotel Management Suite</small>
      </span>
    </a>
  `
})
export class BrandMarkComponent {}
