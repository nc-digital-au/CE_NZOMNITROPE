import { Component, Input} from '@angular/core';
import { Carer } from '../../patient.model';

@Component({
  selector: 'app-carer-summary-information',
  standalone: true,
  imports: [],
  templateUrl: './carer-summary-information.component.html',
  styleUrl: './carer-summary-information.component.scss'
})
export class CarerSummaryInformationComponent {
  @Input({required:true}) carer?: Carer;
}
