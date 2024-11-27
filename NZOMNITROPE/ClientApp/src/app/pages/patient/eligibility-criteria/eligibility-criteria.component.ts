import { Component, Input } from '@angular/core';
import { CONTACT_VALUES } from 'src/app/utils/constants';
import { SvgIconComponent } from 'angular-svg-icon';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { LeavingSiteComponent } from 'src/app/components/leaving-site/leaving-site.component';

@Component({
  selector: 'app-eligibility-criteria',
  standalone: true,
  imports: [ 
    CommonModule,
    HttpClientModule, 
    SvgIconComponent,
    LeavingSiteComponent
  ],
  templateUrl: './eligibility-criteria.component.html',
  styleUrl: './eligibility-criteria.component.scss'
})
export class EligibilityCriteriaComponent {
  @Input() isDialog : boolean;
  contactValue = CONTACT_VALUES;
}
