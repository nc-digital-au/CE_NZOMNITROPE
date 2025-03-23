import { Component, Input } from '@angular/core';
import { DynamicFormComponentBase } from '../../dynamic-form-component-base.model';
import { FormElement } from '../../../models/form-elements/form-element.model';
import { ToggleButtonFormInputElement } from '../../../models/form-elements/toggle-button-form-input-element.model';
import { FormGroup, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { MatError } from '@angular/material/form-field';

@Component({
  selector: 'app-toggle-button-form-element',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonToggleGroup,
    MatButtonToggle,
    MatError,
  ],
  templateUrl: './toggle-button-form-element.component.html',
  styleUrl: './toggle-button-form-element.component.scss'
})
export class ToggleButtonFormElementComponent extends DynamicFormComponentBase {
  @Input()
  set formElement(value: FormElement) {
    this.toggleButtonFormElement = value as any;
  }

  @Input()
  form: FormGroup;

  @Input()
  tempForm: FormGroupDirective;

  toggleButtonFormElement: ToggleButtonFormInputElement;
}
