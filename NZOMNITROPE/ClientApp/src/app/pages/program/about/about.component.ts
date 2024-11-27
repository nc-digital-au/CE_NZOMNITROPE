import { Component } from '@angular/core';
import { EligibilityCriteriaComponent } from '../../patient/eligibility-criteria/eligibility-criteria.component';
import { SvgIconComponent } from 'angular-svg-icon';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [ 
    EligibilityCriteriaComponent, 
    HttpClientModule, 
    SvgIconComponent,
  ],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {

}
