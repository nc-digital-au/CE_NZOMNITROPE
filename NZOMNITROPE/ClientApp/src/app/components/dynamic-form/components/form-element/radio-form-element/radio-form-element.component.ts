import { Component, Input } from '@angular/core';
import { FormGroup, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { FormElement } from '../../../models/form-elements/form-element.model';
import { SelectFormInputElement } from '../../../models/form-elements/select-form-input-element.model';
import { DynamicFormComponentBase } from '../../dynamic-form-component-base.model';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { MatError } from '@angular/material/form-field';

@Component({
  selector: 'app-radio-form-element',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatRadioGroup,
    MatRadioButton,
    MatError,
  ],
  templateUrl: './radio-form-element.component.html',
  styleUrl: './radio-form-element.component.scss'
})
export class RadioFormElementComponent extends DynamicFormComponentBase {
  @Input()
  set formElement(value: FormElement) {
    this.radioFormElement = value as any;
  }

  @Input()
  form: FormGroup;

  @Input()
  tempForm: FormGroupDirective;

  radioFormElement: SelectFormInputElement;
}
