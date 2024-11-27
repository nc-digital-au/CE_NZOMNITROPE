import { Component, Input } from '@angular/core';
import { DynamicFormComponentBase } from '../../dynamic-form-component-base.model';
import { FormElement } from '../../../models/form-elements/form-element.model';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DateFormInputElement } from '../../../models/form-elements/date-form-input-element.model';
import { MaterialModule } from 'src/app/material.module';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { DATE_FORMAT } from 'src/app/utils/constants';
import { CustomDateAdaptor } from 'src/app/utils/helpers/custom-date-adaptor';

@Component({
  selector: 'app-date-form-element',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MaterialModule,
  ],
  templateUrl: './date-form-element.component.html',
  styleUrl: './date-form-element.component.scss',
  providers: [
    { provide: DateAdapter, useClass: CustomDateAdaptor },
    { provide: MAT_DATE_FORMATS, useValue: DATE_FORMAT },
    { provide: MAT_DATE_LOCALE, useValue: 'en-AU' },
  ],
})
export class DateFormElementComponent extends DynamicFormComponentBase {
  @Input()
  set formElement(value: FormElement) {
    this.dateFormElement = value as any;
  }

  @Input()
  form: FormGroup;

  dateFormElement: DateFormInputElement;
}
