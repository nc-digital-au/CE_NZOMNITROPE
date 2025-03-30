import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CONTACT_VALUES } from 'src/app/utils/constants';
import { routeNames } from 'src/app/utils/routes';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatIcon
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  public authenticated$ = this.auth.getIsAuthenticated();
  public anonymous$ = this.auth.getIsAnonymous();

  constructor(
    public dialog: MatDialog,
    private auth: AuthenticationService,
    private router: Router
  ){}
  CONTACT_VALUES = CONTACT_VALUES;

  onOrderDeviceClick(): void {
    this.router.navigate([routeNames.order]);
  }

  onScheduleTrainingClick(): void {
    this.router.navigate([routeNames.schedule]);
  }

  onWatchVideoClick(): void {
    this.router.navigate([routeNames.resources]);
  }
}
