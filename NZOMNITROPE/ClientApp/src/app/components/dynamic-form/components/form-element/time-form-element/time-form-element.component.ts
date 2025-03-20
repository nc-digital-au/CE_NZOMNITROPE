import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormElement } from '../../../models/form-elements/form-element.model';
import { DynamicFormComponentBase } from '../../dynamic-form-component-base.model';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { TimePickerModule } from '@syncfusion/ej2-angular-calendars';
import { MaterialModule } from 'src/app/material.module';

@Component({
  selector: 'app-time-form-element',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule, 
    MatInputModule,      
    TimePickerModule,
    MaterialModule
  ],
  templateUrl: './time-form-element.component.html',
  styleUrl: './time-form-element.component.scss'
})
export class TimeFormElementComponent extends DynamicFormComponentBase {
  @Input()
  set formElement(value: FormElement) {
    this.timeFormElement = value as any;
  }

  @Input() form: FormGroup;

  timeFormElement: any;
}
