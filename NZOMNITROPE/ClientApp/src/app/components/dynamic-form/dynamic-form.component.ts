import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { DynamicForm } from './models/dynamic-form.model';
import { FormElementComponent } from './components/form-element/form-element.component';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormInputElement } from './models/form-elements/form-input-element.model';
import { FormElement } from './models/form-elements/form-element.model';
import { GroupFormElement } from './models/form-elements/group-form-element.model';
import { ageValidator } from 'src/app/utils/validators/age.validator';
import { oneRequired } from 'src/app/utils/validators/one-required.validator';
import { requiredLengthValidator } from 'src/app/utils/validators/required-length.validator';
import { CheckboxFormInputElement } from './models/form-elements/checkbox-form-input-element.model';
import { ValidatePhone } from 'src/app/utils/validators/phone.validator';
import { ValidateMobile } from 'src/app/utils/validators/mobile.validator';

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormElementComponent,
  ],
  templateUrl: './dynamic-form.component.html',
  styleUrl: './dynamic-form.component.scss',
})
export class DynamicFormComponent implements OnChanges {
  @Input()
  formDefinition: DynamicForm;

  @Output()
  formCreated = new EventEmitter<FormGroup>();
  @Output()
  tempFormCreated = new EventEmitter<FormGroupDirective>();

  @ViewChild('tempForm')
  tempForm: FormGroupDirective;

  form = this._fb.group({});
  formReady = false;

  constructor(
    private _fb: FormBuilder,
    private _cd: ChangeDetectorRef,
  ) { 
    this.form = new FormGroup({});
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['formDefinition']) {
      this.form = this._fb.group({});
      if (this.formDefinition?.children && this.formDefinition.children.length) {
        this.buildForm(this.formDefinition.children);
      }
      setTimeout(() => {
        this.formReady = true;
        this.formCreated.emit(this.form);
        this._cd.detectChanges();
        this.tempFormCreated.emit(this.tempForm);
      });
    }
  }

  setValue(name: string, value: any): void {
    const control = this.form.get(name);
    if (control) {
      control.setValue(value);
      control.updateValueAndValidity();
    }
  }

  private buildForm(formElements: FormElement[]): void {
    for (const formElement of formElements) {
      if (formElement instanceof FormInputElement) {
        const validations = [];
        const asyncValidators = [];
        if (formElement.validation) {
          if (formElement.validation.required) {
            if (formElement instanceof CheckboxFormInputElement) {
              validations.push(Validators.requiredTrue);
            } else {
              validations.push(Validators.required);
            }
          }
          if ('maxLength' in formElement.validation) {
            validations.push(Validators.maxLength(+formElement.validation.maxLength));
          }
          if ('minLength' in formElement.validation) {
            validations.push(Validators.minLength(+formElement.validation.minLength));
          }
          if ('requiredLength' in formElement.validation) {
            validations.push(requiredLengthValidator(+formElement.validation.requiredLength));
          }
          if ('age' in formElement.validation) {
            validations.push(ageValidator(+formElement.validation.age));
          }
          if ('numbersOnly' in formElement.validation) {
            validations.push(Validators.pattern('^[0-9]*$'));
          }
          if ('email' in formElement.validation) {
            validations.push(Validators.email);
          }
          if ('phone' in formElement.validation) {
            validations.push(ValidatePhone);
          }
          if ('mobile' in formElement.validation) {
            validations.push(ValidateMobile);
          }

          if ('custom' in formElement.validation) {
            for (const custom of formElement.validation.custom as any[]) {
              validations.push(custom);
            }
          }

          if ('customAsync' in formElement.validation) {
            for (const custom of formElement.validation.customAsync as any[]) {
              asyncValidators.push(custom);
            }
          }
        }

        this.form.addControl(formElement.name, new FormControl({
          value: formElement.value,
          disabled: formElement.disabled,
        }, validations, asyncValidators));
      } else if (formElement instanceof GroupFormElement) {
        this.buildForm(formElement.children);
        if (formElement.options && formElement.options.requireAtLeastOne) {
          const elementNames: string[] = [];
          for (const childElement of formElement.children) {
            if (childElement instanceof FormInputElement) {
              elementNames.push(childElement.name);
            }
          }
          if (elementNames.length) {
            this.form.addValidators(oneRequired(elementNames));
          }
        }
      }
    }
  }
}
