import { Component, Input } from '@angular/core';
import { Patient } from '../../patient.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-patient-summary-information',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './patient-summary-information.component.html',
  styleUrl: './patient-summary-information.component.scss'
})
export class PatientSummaryInformationComponent {
  @Input({required: true}) patient!: Patient;
}
