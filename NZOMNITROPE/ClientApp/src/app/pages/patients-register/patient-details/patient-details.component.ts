import { Component, EventEmitter, Output } from '@angular/core';
import { AbstractControl, FormGroup, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { DynamicFormComponent } from 'src/app/components/dynamic-form/dynamic-form.component';
import { DynamicForm } from 'src/app/components/dynamic-form/models/dynamic-form.model';
import { GroupFormElement } from 'src/app/components/dynamic-form/models/form-elements/group-form-element.model';
import { SelectFormInputElement } from 'src/app/components/dynamic-form/models/form-elements/select-form-input-element.model';
import { TextFormInputElement } from 'src/app/components/dynamic-form/models/form-elements/text-form-input-element.model';
import { TitleFormElement } from 'src/app/components/dynamic-form/models/form-elements/title-form-element.model';
import { DynamicFormHelper } from 'src/app/components/dynamic-form/models/helpers/dynamic-form-helper.model';
import { UI_DEFAULTS } from 'src/app/utils/constants';
import { TitleLabel } from 'src/app/utils/enums/enum-label';
import { PrescriberValidator } from 'src/app/utils/validators/prescriber.validator';
import { Title } from 'src/app/services/service-proxies/service-proxies';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { DateFormInputElement } from 'src/app/components/dynamic-form/models/form-elements/date-form-input-element.model';

enum PrescriberTitle {
  Mr = Title.Mr,
  Mrs = Title.Mrs,
  Ms = Title.Ms,
  Miss = Title.Miss,
  Mx = Title.Mx
}

@Component({
  selector: 'app-patient-details',
  standalone: true,
  imports: [DynamicFormComponent,
    CommonModule,
    MaterialModule,
    ReactiveFormsModule],
  templateUrl: './patient-details.component.html',
  styleUrl: './patient-details.component.scss'
})

export class PatientDetailsComponent {
@Output()
  formCreated = new EventEmitter<FormGroup>();
  
  formDefinition: DynamicForm;

  constructor() {
    this.buildForm();
  }

  onFormCreated(form: FormGroup): void {
    this.formCreated.emit(form);
  }  

  
  private buildForm(): void {
      const titleOptions = DynamicFormHelper.enumToSelectOptions(PrescriberTitle, TitleLabel);
  
      this.formDefinition = new DynamicForm([
        new TitleFormElement({
          label: 'Prescriber profile',
        }),
        new GroupFormElement({
          children: [
            new SelectFormInputElement({
              name: 'title',
              label: 'Title',
              options:  titleOptions,
              validation: {
                required: true,
              },
            }),
            undefined,
          ],
        }),
        new GroupFormElement({
          children: [
        new TextFormInputElement({
          name: 'firstName',
          label: 'First name',
          validation: {
            required: true,
            maxLength: UI_DEFAULTS.TEXT_INPUT_LIMIT,
          },
        }),
        new TextFormInputElement({
          name: 'lastName',
          label: 'Last name',
          validation: {
            required: true,
            maxLength: UI_DEFAULTS.TEXT_INPUT_LIMIT,
          },
        }),
      ],
    }),
        new DateFormInputElement({
          name: 'patientDob',
          label: 'Date of birth',
          validation: {
            required: true,
          },
        }),
        new GroupFormElement({
          children: [
            new TextFormInputElement({
              name: 'nih',
              label: 'National Health Index Number (NIH)',
              hint: 'NIH must be ABC1234',
              validation: {
                required: true,
                maxLength: 13,
                custom: [
                  PrescriberValidator.nihNumberFormat,
                ],
              },
            }),
            new TextFormInputElement({
              name: 'specialty',
              label: 'Specialty',
              validation: {
                required: true,
              },
            }),
          ],
        }),
        new TitleFormElement({
          label: 'Credentials',
        }),
        new GroupFormElement({
          children: [
            new TextFormInputElement({
              name: 'email',
              label: 'Email',
              validation: {
                required: true,
                minLength: 8,
              },
            }),
          ],
        }),
        new GroupFormElement({
          children: [
            new TextFormInputElement({
              name: 'password',
              label: 'Password',
              validation: {
                required: true,
                password: true,
                minLength: 8,
                custom: [
                  PrescriberValidator.passwordValidator,
                ],
              },
            }),
          ],
        }),
        new GroupFormElement({
          children: [
            new TextFormInputElement({
              name: 'confirmPassword',
              label: 'Confirm Password',
              validation: {
                required: true,
                password: true,
                minLength: 8,
                custom: [
                  PrescriberValidator.matchPasswords,
                ],
              },
            }),
          ],
        }),
      ]);
    }
  }
  