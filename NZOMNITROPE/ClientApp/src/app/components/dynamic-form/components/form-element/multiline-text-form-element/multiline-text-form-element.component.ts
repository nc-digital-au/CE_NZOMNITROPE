import { Component, Input } from '@angular/core';
import { FormElement } from '../../../models/form-elements/form-element.model';
import { MultilineTextFormInputElement } from '../../../models/form-elements/multiline-text-form-input-element.model';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatError, MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { DynamicFormComponentBase } from '../../dynamic-form-component-base.model';

@Component({
  selector: 'app-multiline-text-form-element',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatError,
  ],
  templateUrl: './multiline-text-form-element.component.html',
  styleUrl: './multiline-text-form-element.component.scss'
})
export class MultilineTextFormElementComponent extends DynamicFormComponentBase {
  @Input()
  set formElement(value: FormElement) {
    this.multilineTextFormElement = value as any;
    
    if (this.multilineTextFormElement.hidden) {
      this.inputType = 'hidden';
    }
    if(this.multilineTextFormElement.placeholder !== undefined) {
      this.placeholder = this.multilineTextFormElement.placeholder;
    }
    else{
      this.multilineTextFormElement.placeholder = '';
    }
  }  

  @Input()
  form: FormGroup;

  multilineTextFormElement: MultilineTextFormInputElement;
  inputType: string;
  placeholder: string = '';
}
