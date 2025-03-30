import { AfterViewInit, Component, forwardRef, Input } from '@angular/core';
import { FormElement } from '../../models/form-elements/form-element.model';
import { FormElementType } from '../../enums/form-element-type.enum';
import { TextFormElementComponent } from './text-form-element/text-form-element.component';
import { FormGroup, FormGroupDirective } from '@angular/forms';
import { MatLabel } from '@angular/material/form-field';
import { SelectFormElementComponent } from './select-form-element/select-form-element.component';
import { GroupFormElementComponent } from './group-form-element/group-form-element.component';
import { DateFormElementComponent } from './date-form-element/date-form-element.component';
import { MultilineTextFormElementComponent } from './multiline-text-form-element/multiline-text-form-element.component';
import { ToggleButtonFormElementComponent } from './toggle-button-form-element/toggle-button-form-element.component';
import { DisplayFormElementComponent } from './display-form-element/display-form-element.component';
import { CheckboxFormElementComponent } from './checkbox-form-element/checkbox-form-element.component';
import { FormInputElement } from '../../models/form-elements/form-input-element.model';
import { RadioFormElementComponent } from './radio-form-element/radio-form-element.component';
import { IFormValidation } from '../../interfaces/form-validation.interface';
import { TitleFormElement } from '../../models/form-elements/title-form-element.model';
import { TimeFormElementComponent } from './time-form-element/time-form-element.component';

@Component({
  selector: 'app-form-element',
  standalone: true,
  imports: [
    MatLabel,
    forwardRef(() => GroupFormElementComponent),
    TextFormElementComponent,
    SelectFormElementComponent,
    DateFormElementComponent,
    MultilineTextFormElementComponent,
    ToggleButtonFormElementComponent,
    DisplayFormElementComponent,
    CheckboxFormElementComponent,
    RadioFormElementComponent,
    TimeFormElementComponent
  ],
  templateUrl: './form-element.component.html',
  styleUrl: './form-element.component.scss'
})
export class FormElementComponent implements AfterViewInit {
  @Input() formElement: FormElement;
  @Input() form: FormGroup;
  @Input() tempForm: FormGroupDirective;
  @Input() formClass = 'col-lg-12';

  FormElementType = FormElementType;
  hidden = false;
  label: string = '';
  validation?: IFormValidation = undefined;

  ngAfterViewInit(): void {
    if (this.formElement instanceof FormInputElement) {
      this.label = this.formElement.label;
      this.validation = this.formElement.validation;
    }

    if (this.formElement instanceof TitleFormElement) {
      this.label = this.formElement.label;
    }

    if (this.formElement instanceof FormInputElement && this.formElement.hidden) {
      setTimeout(() => {
        this.hidden = true;
      });
    }
  }

  get isTitle(): boolean {
    return this.formElement?.type === FormElementType.Title;
  }
  
  get titleLabel(): string {
    return this.isTitle ? (this.formElement as TitleFormElement).label : '';
  }
}
