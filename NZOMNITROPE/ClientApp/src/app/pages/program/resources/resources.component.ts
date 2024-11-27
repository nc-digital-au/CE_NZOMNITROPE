import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { SvgIconComponent } from 'angular-svg-icon';
import { EligibilityCriteriaDialogComponent } from '../../patient/eligibility-criteria/eligibility-criteria-dialog/eligibility-criteria-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-resources',
  standalone: true,
  imports: [ 
    HttpClientModule, 
    SvgIconComponent, 
    EligibilityCriteriaDialogComponent
  ],
  templateUrl: './resources.component.html',
  styleUrl: './resources.component.scss'
})
export class ResourcesComponent {
  constructor(public dialog: MatDialog){}

  openEligibilityCriteria(){
    this.dialog.open(EligibilityCriteriaDialogComponent);
  }
}
