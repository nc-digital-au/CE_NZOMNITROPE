import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CoreService } from 'src/app/services/core.service';

@Component({
  selector: 'app-auth-branding',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="d-flex align-items-center">
      <a [routerLink]="['/']" class="logodark">
      </a>

      <a [routerLink]="['/']" class="logolight">
      </a>
    </div>
  `,
})
export class AppAuthBrandingComponent {
  options = this.settings.getOptions();

  constructor(private settings: CoreService) {}
}
