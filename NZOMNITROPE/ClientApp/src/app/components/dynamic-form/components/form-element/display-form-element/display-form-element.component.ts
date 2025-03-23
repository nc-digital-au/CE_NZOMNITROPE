import { Component, Input } from '@angular/core';
import { FormElement } from '../../../models/form-elements/form-element.model';
import { DynamicFormComponentBase } from '../../dynamic-form-component-base.model';
import { DisplayFormat, DisplayFormElement } from '../../../models/form-elements/display-form-element.model';
import { MatLabel } from '@angular/material/form-field';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-display-form-element',
  standalone: true,
  imports: [
    DatePipe,
    MatLabel,
  ],
  templateUrl: './display-form-element.component.html',
  styleUrl: './display-form-element.component.scss',
})
export class DisplayFormElementComponent extends DynamicFormComponentBase {
  @Input()
  set formElement(value: FormElement) {
    this.displayFormElement = value as any;
  }

  displayFormElement: DisplayFormElement;

  DisplayFormat = DisplayFormat;
}
