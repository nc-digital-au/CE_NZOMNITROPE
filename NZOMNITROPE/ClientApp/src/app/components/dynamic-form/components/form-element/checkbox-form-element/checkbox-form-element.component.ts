import { Component, Input } from '@angular/core';
import { FormGroup, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { FormElement } from '../../../models/form-elements/form-element.model';
import { CheckboxFormInputElement } from '../../../models/form-elements/checkbox-form-input-element.model';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatError, MatLabel } from '@angular/material/form-field';
import { DynamicFormComponentBase } from '../../dynamic-form-component-base.model';

@Component({
  selector: 'app-checkbox-form-element',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCheckbox,
    MatLabel,
    MatError,
  ],
  templateUrl: './checkbox-form-element.component.html',
  styleUrl: './checkbox-form-element.component.scss'
})
export class CheckboxFormElementComponent extends DynamicFormComponentBase {
  @Input()
  set formElement(value: FormElement) {
    this.checkboxFormElement = value as any;
  }

  @Input()
  form: FormGroup;

  @Input()
  tempForm: FormGroupDirective;

  checkboxFormElement: CheckboxFormInputElement;
}
