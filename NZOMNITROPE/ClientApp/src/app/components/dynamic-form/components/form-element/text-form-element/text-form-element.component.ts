import { Component, Input } from '@angular/core';
import { FormElement } from '../../../models/form-elements/form-element.model';
import { TextFormInputElement } from '../../../models/form-elements/text-form-input-element.model';
import { MatError, MatFormField, MatHint } from '@angular/material/form-field';
import { DynamicFormComponentBase } from '../../dynamic-form-component-base.model';
import { MatInput } from '@angular/material/input';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-text-form-element',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatError,
    MatInput,
    MatHint,
  ],
  templateUrl: './text-form-element.component.html',
  styleUrl: './text-form-element.component.scss'
})
export class TextFormElementComponent extends DynamicFormComponentBase {
  @Input()
  set formElement(value: FormElement) {
    this.textFormElement = value as any;
    if (this.textFormElement.hidden) {
      this.inputType = 'hidden';
    } else if (this.textFormElement?.validation) {
      if (this.textFormElement.validation.numbersOnly) {
        this.inputType = 'number';
      } else if (this.textFormElement.validation.email) {
        this.inputType = 'email';
      } else if (this.textFormElement.validation.password) {
        this.inputType = 'password';
      }
    }
  }

  @Input()
  form: FormGroup;

  textFormElement: TextFormInputElement;
  inputType = 'text';
}
