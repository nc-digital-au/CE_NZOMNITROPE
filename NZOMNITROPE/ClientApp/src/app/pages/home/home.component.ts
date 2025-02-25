import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
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
  router: any;

  constructor(
    public dialog: MatDialog,
    private auth: AuthenticationService,
    private patientSvc: PatientService,
    
  ){}
  CONTACT_VALUES = CONTACT_VALUES;

  onOrderDeviceClick(): void {
    this.router.navigate(['/order-device']);
  }

  onScheduleTrainingClick(): void {
    this.router.navigate(['/schedule-training']);
  }
}
