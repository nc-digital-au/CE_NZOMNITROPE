import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { SvgIconComponent } from 'angular-svg-icon';
import { MaterialModule } from 'src/app/material.module';
import { CONTACT_VALUES} from 'src/app/utils/constants';
import { EligibilityCriteriaDialogComponent } from '../../patient/eligibility-criteria/eligibility-criteria-dialog/eligibility-criteria-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-faqs',
  standalone: true,
  imports: [
    MaterialModule,
    HttpClientModule, 
    SvgIconComponent,
    EligibilityCriteriaDialogComponent,
    RouterLink
  ],
  templateUrl: './faqs.component.html',
  styleUrl: './faqs.component.scss'
})
export class FaqsComponent {
  contactValue = CONTACT_VALUES;
  panelOpenState = false;

  constructor(public dialog: MatDialog){}

  openEligibilityCriteria(){
    this.dialog.open(EligibilityCriteriaDialogComponent);
  }

}
