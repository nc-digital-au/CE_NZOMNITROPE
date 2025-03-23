import { Component, Input } from '@angular/core';
import { FormElement } from '../../../models/form-elements/form-element.model';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SelectFormInputElement } from '../../../models/form-elements/select-form-input-element.model';
import { MatError, MatFormField } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
import { DynamicFormComponentBase } from '../../dynamic-form-component-base.model';

@Component({
  selector: 'app-select-form-element',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatSelect,
    MatOption,
    MatError,
  ],
  templateUrl: './select-form-element.component.html',
  styleUrl: './select-form-element.component.scss'
})
export class SelectFormElementComponent extends DynamicFormComponentBase {
  @Input()
  set formElement(value: FormElement) {
    this.selectFormElement = value as any;
  }

  @Input()
  form: FormGroup;

  selectFormElement: SelectFormInputElement;
}
