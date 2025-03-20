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
import { FormInputElement } from '../../models/form-elements/form-input-element.model';
import { CheckboxFormElementComponent } from './checkbox-form-element/checkbox-form-element.component';
import { DisplayFormElementComponent } from './display-form-element/display-form-element.component';
import { RadioFormElementComponent } from './radio-form-element/radio-form-element.component';
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
    CheckboxFormElementComponent,
    DisplayFormElementComponent,
    RadioFormElementComponent,
    TimeFormElementComponent
  ],
  templateUrl: './form-element.component.html',
  styleUrl: './form-element.component.scss'
})
export class FormElementComponent implements AfterViewInit {
  @Input()
  formElement: FormElement;

  @Input()
  form: FormGroup;

  @Input()
  tempForm: FormGroupDirective;

  @Input()
  formClass = 'col-lg-12';

  FormElementType = FormElementType;
  hidden = false;

  ngAfterViewInit(): void {
    if (this.formElement instanceof FormInputElement && this.formElement.hidden) {
      setTimeout(() => {
        this.hidden = true;
      });
    }
  }
}
