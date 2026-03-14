import { ChangeDetectionStrategy, Component } from '@angular/core';

import { demoUsers } from '../../core/data/demo-data';

@Component({
  selector: 'app-admin-staff-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Staff management</p>
          <h1>Role assignment, activation, and account oversight.</h1>
        </div>
      </div>
      <div class="table-shell surface">
        <table>
          <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Phone</th></tr></thead>
          <tbody>
            @for (user of users; track user.id) {
              <tr>
                <td>{{ user.name }}</td>
                <td>{{ user.email }}</td>
                <td><span class="pill">{{ user.role }}</span></td>
                <td>{{ user.phone }}</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </section>
  `
})
export class AdminStaffPageComponent {
  protected readonly users = demoUsers;
}
