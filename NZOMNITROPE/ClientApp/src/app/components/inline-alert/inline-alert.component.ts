import { Component, Input } from '@angular/core';
import { SvgIconComponent } from 'angular-svg-icon';

@Component({
  selector: 'app-inline-alert',
  standalone: true,
  imports: [
    SvgIconComponent,
  ],
  templateUrl: './inline-alert.component.html',
  styleUrl: './inline-alert.component.scss'
})
export class InlineAlertComponent {
  @Input()
  success = true;

  @Input()
  margin = 20;

  @Input()
  marginBottom = 20;

  @Input()
  theme = 'bg-dark-success';

  @Input()
  color = 'text-white';
}
