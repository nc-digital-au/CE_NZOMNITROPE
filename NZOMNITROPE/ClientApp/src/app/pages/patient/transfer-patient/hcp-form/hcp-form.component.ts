import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicFormComponent } from 'src/app/components/dynamic-form/dynamic-form.component';
import { DynamicForm } from 'src/app/components/dynamic-form/models/dynamic-form.model';
import { GroupFormElement } from 'src/app/components/dynamic-form/models/form-elements/group-form-element.model';
import { SelectFormInputElement } from 'src/app/components/dynamic-form/models/form-elements/select-form-input-element.model';
import { TextFormInputElement } from 'src/app/components/dynamic-form/models/form-elements/text-form-input-element.model';
import { TitleFormElement } from 'src/app/components/dynamic-form/models/form-elements/title-form-element.model';
import { DynamicFormHelper } from 'src/app/components/dynamic-form/models/helpers/dynamic-form-helper.model';
import { Title } from 'src/app/services/service-proxies/service-proxies';
import { UI_DEFAULTS } from 'src/app/utils/constants';
import { TitleLabel } from 'src/app/utils/enums/enum-label';

enum HcpTitle {
  Dr = Title.Dr,
  Prof = Title.Prof,
  AssocProf = Title.AssocProf,
}

@Component({
  selector: 'app-hcp-form',
  standalone: true,
  imports: [
    DynamicFormComponent,
  ],
  templateUrl: './hcp-form.component.html',
  styleUrl: './hcp-form.component.scss',
})
export class HcpFormComponent {
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
    const titleOptions = DynamicFormHelper.enumToSelectOptions(HcpTitle, TitleLabel);

    this.formDefinition = new DynamicForm([
      new TitleFormElement({
        label: 'Nominated Healthcare Professional Details',
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
          new TextFormInputElement({
            name: 'email',
            label: 'Email',
            validation: {
              required: true,
              email: true,
            },
          }),
          undefined,
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
      new TitleFormElement({
        label: 'Clinic Details',
      }),
      new GroupFormElement({
        children: [
          new TextFormInputElement({
            name: 'clinicName',
            label: 'Clinic name',
            validation: {
              required: true,
              maxLength: UI_DEFAULTS.TEXT_INPUT_LIMIT,
            },
          }),
          new TextFormInputElement({
            name: 'clinicPhone',
            label: 'Clinic contact number',
            validation: {
              required: true,
              phone: true,
            },
          }),
        ],
      }),
    ]);
  }
}