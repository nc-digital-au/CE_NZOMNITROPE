import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicFormComponent } from 'src/app/components/dynamic-form/dynamic-form.component';
import { DynamicForm } from 'src/app/components/dynamic-form/models/dynamic-form.model';
import { GroupFormElement } from 'src/app/components/dynamic-form/models/form-elements/group-form-element.model';
import { SelectFormInputElement, SelectOption } from 'src/app/components/dynamic-form/models/form-elements/select-form-input-element.model';
import { TextFormInputElement } from 'src/app/components/dynamic-form/models/form-elements/text-form-input-element.model';
import { TitleFormElement } from 'src/app/components/dynamic-form/models/form-elements/title-form-element.model';
import { DynamicFormHelper } from 'src/app/components/dynamic-form/models/helpers/dynamic-form-helper.model';
import { RegistrationServiceProxy, Title } from 'src/app/services/service-proxies/service-proxies';
import { UI_DEFAULTS } from 'src/app/utils/constants';
import { TitleLabel } from 'src/app/utils/enums/enum-label';
import { PrescriberValidator } from 'src/app/utils/validators/prescriber.validator';

enum PrescriberTitle {
  Dr = Title.Dr,
  Prof = Title.Prof,
  AssocProf = Title.AssocProf,
}

@Component({
  selector: 'app-profile-form',
  standalone: true,
  imports: [
    DynamicFormComponent,
  ],
  templateUrl: './profile-form.component.html',
  styleUrl: './profile-form.component.scss',
})
export class ProfileFormComponent {
  @Output()
  formCreated = new EventEmitter<FormGroup>();
  
  profileFormDefinition: DynamicForm;

  constructor(
    private readonly _registrationService: RegistrationServiceProxy,
  ) {
    this.buildForm();
  }

  onFormCreated(form: FormGroup): void {
    this.formCreated.emit(form);
  }

  private buildForm(): void {
    const titleOptions = DynamicFormHelper.enumToSelectOptions(PrescriberTitle, TitleLabel);

    this.profileFormDefinition = new DynamicForm([
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
          new TextFormInputElement({
            name: 'ahpraNumber',
            label: 'AHPRA number',
            validation: {
              required: true,
              maxLength: 13,
              custom: [
                PrescriberValidator.ahpraNumberFormat,
              ],
              customAsync: [
                PrescriberValidator.ahpraNumberUnique(this._registrationService),
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
              email: true,
            },
          }),
          new TextFormInputElement({
            name: 'password',
            label: 'Password',
            validation: {
              required: true,
              password: true,
              minLength: 8,
            },
          }),
        ],
      }),
    ]);
  }
}
