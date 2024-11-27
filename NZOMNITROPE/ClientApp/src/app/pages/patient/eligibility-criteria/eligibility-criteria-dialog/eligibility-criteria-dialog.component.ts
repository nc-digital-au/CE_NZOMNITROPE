import { Component, Inject } from '@angular/core';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { EligibilityCriteriaComponent } from '../eligibility-criteria.component';

@Component({
  selector: 'app-eligibility-criteria-dialog',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, EligibilityCriteriaComponent],
  templateUrl: './eligibility-criteria-dialog.component.html',
  styleUrl: './eligibility-criteria-dialog.component.scss'
})
export class EligibilityCriteriaDialogComponent {
  constructor(){}
}
