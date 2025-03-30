import { CommonModule, JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { MatError, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatOption } from '@angular/material/select';
import { DynamicFormComponentBase } from '../../dynamic-form-component-base.model';
import { TimeFormInputElement } from '../../../models/form-elements/time-form-input-element.model';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { MatInput } from '@angular/material/input';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-time-form-element',
  templateUrl: './time-form-element.component.html',
  styleUrl: './time-form-element.component.scss',
  standalone: true,
  imports: [
    MatFormFieldModule,
    ReactiveFormsModule,
    MatTimepickerModule,
    MatLabel,
    MatInput,
    MatOption,
    ReactiveFormsModule,
    CommonModule,
    MatError,
    JsonPipe
  ],
  providers: [
    provideNativeDateAdapter(),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimeFormElementComponent extends DynamicFormComponentBase {
  @Input()
  set formElement(value: any) {
    this.timeFormElement = value;
  }

  timeFormElement: TimeFormInputElement;
  timeControl = new FormControl<Date | null>(null);

  @Input()
  form: FormGroup;
  // timeControl = new FormControl<string | null>(null);
}
