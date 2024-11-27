import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EligibilityCriteriaDialogComponent } from '../patient/eligibility-criteria/eligibility-criteria-dialog/eligibility-criteria-dialog.component';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { HttpClient } from '@angular/common/http';
import { PatientService } from 'src/app/services/patient.service';

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
    private patientSvc: PatientService
  ){}

  openEligibilityCriteria(){
    this.dialog.open(EligibilityCriteriaDialogComponent);
  }

}
