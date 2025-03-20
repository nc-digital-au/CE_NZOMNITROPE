import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { PatientService } from 'src/app/services/patient.service';
import { CONTACT_VALUES } from 'src/app/utils/constants';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  public authenticated$ = this.auth.getIsAuthenticated();
  public anonymous$ = this.auth.getIsAnonymous();

  constructor(
    public dialog: MatDialog,
    private auth: AuthenticationService,
    private patientSvc: PatientService,
    private router: Router
  ){}
  CONTACT_VALUES = CONTACT_VALUES;

  onOrderDeviceClick(): void {
    this.router.navigate(['/order']);
  }

  onScheduleTrainingClick(): void {
    this.router.navigate(['/schedule']);
  }

  onWatchVideoClick(): void {
    this.router.navigate(['/resources/how-to-inject']);
  }
}
