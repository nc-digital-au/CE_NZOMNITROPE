import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { DynamicFormComponent } from 'src/app/components/dynamic-form/dynamic-form.component';
import { DynamicForm } from 'src/app/components/dynamic-form/models/dynamic-form.model';
import { CheckboxFormInputElement } from 'src/app/components/dynamic-form/models/form-elements/checkbox-form-input-element.model';
import { GroupFormElement } from 'src/app/components/dynamic-form/models/form-elements/group-form-element.model';
import { TextFormInputElement } from 'src/app/components/dynamic-form/models/form-elements/text-form-input-element.model';
import { TitleFormElement } from 'src/app/components/dynamic-form/models/form-elements/title-form-element.model';
import { UI_DEFAULTS } from 'src/app/utils/constants';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [
    DynamicFormComponent,
    CommonModule,
    FormsModule],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.scss'
})

export class RegisterFormComponent {
  @Output()
    formCreated = new EventEmitter<FormGroup>();
    formDefinition: DynamicForm;


  constructor(
    private fb: FormBuilder,){
    this.buildForm();
  }

  onFormCreated(form: FormGroup): void {
    this.formCreated.emit(form);
  }

  buildForm(): void {

    this.formDefinition = new DynamicForm([
      new GroupFormElement({
        children: [
         new TextFormInputElement({
            name: 'barcode',
            label: 'Barcode - last 4-digits',
            validation: {
            required: true,
            minLength: 4,
            maxLength: 4,
          },
        }),
        undefined,
      ],
    }),
      new CheckboxFormInputElement({
            name: 'consent',
            label: 'I confirm that I have been prescribed Omnitrope® (somatropin)',
            validation: {
              required: true,
            },
          }),
        ]);
      }
    }
