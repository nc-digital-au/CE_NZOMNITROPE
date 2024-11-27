import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicFormComponent } from 'src/app/components/dynamic-form/dynamic-form.component';
import { DynamicForm } from 'src/app/components/dynamic-form/models/dynamic-form.model';
import { DateFormInputElement } from 'src/app/components/dynamic-form/models/form-elements/date-form-input-element.model';
import { GroupFormElement } from 'src/app/components/dynamic-form/models/form-elements/group-form-element.model';
import { SelectFormInputElement } from 'src/app/components/dynamic-form/models/form-elements/select-form-input-element.model';
import { TextFormInputElement } from 'src/app/components/dynamic-form/models/form-elements/text-form-input-element.model';
import { TitleFormElement } from 'src/app/components/dynamic-form/models/form-elements/title-form-element.model';
import { DynamicFormHelper } from 'src/app/components/dynamic-form/models/helpers/dynamic-form-helper.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Gender, PrescriberServiceProxy, Title } from 'src/app/services/service-proxies/service-proxies';
import { BUSINESS_RULES, UI_DEFAULTS } from 'src/app/utils/constants';
import { GenderLabel, TitleLabel } from 'src/app/utils/enums/enum-label';
import { PrescriberValidator } from 'src/app/utils/validators/prescriber.validator';

enum PatientTitle {
  Mr = Title.Mr,
  Mrs = Title.Mrs,
  Ms = Title.Ms,
  Mx = Title.Mx,
}

enum PatientGender {
  Male = Gender.Male,
  Female = Gender.Female,
  NonBinary = Gender.NonBinary,
}

@Component({
  selector: 'app-patient-form',
  standalone: true,
  imports: [
    DynamicFormComponent,
  ],
  templateUrl: './patient-form.component.html',
  styleUrl: './patient-form.component.scss',
})
export class PatientFormComponent {
  @Output()
  formCreated = new EventEmitter<FormGroup>();

  formDefinition: DynamicForm;

  constructor(
    private readonly _prescriberService: PrescriberServiceProxy,
    private readonly _authService: AuthenticationService,
  ) {
    this.buildForm();
  }

  onFormCreated(form: FormGroup): void {
    this.formCreated.emit(form);
  }

  private buildForm(): void {
    const titleOptions = DynamicFormHelper.enumToSelectOptions(PatientTitle, TitleLabel);
    const genderOptions = DynamicFormHelper.enumToSelectOptions(PatientGender, GenderLabel);
    const currentUser = this._authService.currentUser;

    this.formDefinition = new DynamicForm(
      [
        new GroupFormElement({
          children: [
            // TODO: prefill prescriber number if available
            // TODO: disable prescriber number if prefilled
            new TextFormInputElement({
              name: 'prescriberNumber',
              label: 'Prescriber number',
              value: currentUser?.prescriberNumber,
              disabled: !!currentUser?.prescriberNumber,
              validation: {
                required: true,
                prescriberNumber: true,
                numbersOnly: true,
                maxLength: PrescriberValidator.PRESCRIBER_NUMBER_MAX_LENGTH,
                customAsync: [
                  PrescriberValidator.prescriberNumberUnique(this._prescriberService),
                ],
              },
            }),
            undefined,
          ],
        }),
        new TitleFormElement({
          label: 'Patient details',
        }),
        new GroupFormElement({
          children: [
            new SelectFormInputElement({
              name: 'title',
              label: 'Title',
              options: titleOptions,
              validation: {
                required: true,
              },
            }),
            undefined,
          ],
        }),
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
        new GroupFormElement({
          children: [
            new DateFormInputElement({
              name: 'dateOfBirth',
              label: 'Date of birth',
              validation: {
                required: true,
                age: BUSINESS_RULES.LEGAL_AGE,
              },
            }),
            new SelectFormInputElement({
              name: 'gender',
              label: 'Gender',
              options: genderOptions,
              validation: {
                required: true,
              },
            }),
          ],
        }),
        new GroupFormElement({
          children: [
            new TextFormInputElement({
              name: 'phone',
              label: 'Phone number',
              validation: {
                phone: true,
              },
            }),
            new TextFormInputElement({
              name: 'mobile',
              label: 'Mobile number',
              validation: {
                mobile: true,
              },
            }),
          ],
          options: {
            requireAtLeastOne: true,
            requireAtLeastOneMessage: 'Please provide at least one contact number',
          },
        }),
      ]
    );
  }
}
