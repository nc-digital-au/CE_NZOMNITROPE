import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicFormComponent } from 'src/app/components/dynamic-form/dynamic-form.component';
import { DynamicForm } from 'src/app/components/dynamic-form/models/dynamic-form.model';
import { CheckboxFormInputElement } from 'src/app/components/dynamic-form/models/form-elements/checkbox-form-input-element.model';
import { TitleFormElement } from 'src/app/components/dynamic-form/models/form-elements/title-form-element.model';

@Component({
  selector: 'app-consent-form',
  standalone: true,
  imports: [
    DynamicFormComponent,
  ],
  templateUrl: './consent-form.component.html',
  styleUrl: './consent-form.component.scss',
})
export class ConsentFormComponent {
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
    this.formDefinition = new DynamicForm([
      new TitleFormElement({
        label: 'I confirm the following',
      }),
      new CheckboxFormInputElement({
        name: 'agreeToCorrectDetails',
        label: 'I confirm the details provided are correct and authorise the transfer of my patient to the nominated Healthcare Professional.',
        errorLabel: 'Correct details acceptance',
        validation: {
          required: true,
        },
      }),
      new CheckboxFormInputElement({
        name: 'shareDetailsConsent',
        label: 'My patient has consented to have their details shared with the nominated HCP.',
        errorLabel: 'Share details consent acceptance',
        validation: {
          required: true,
        },
      }),
      new CheckboxFormInputElement({
        name: 'informPatientConsent',
        label: 'My patient will be informed their maintenance of care will be transferred to the above Healthcare Professional.',
        errorLabel: 'Inform patient consent acceptance',
        validation: {
          required: true,
        },
      }),
      new CheckboxFormInputElement({
        name: 'myCareUntilTransferredConsent',
        label: 'I acknowledge the patient will remain in my care until the nominated HCP has accepted the patient transfer.',
        errorLabel: 'My care until transferred consent acceptance',
        validation: {
          required: true,
        },
      }),
    ]);
  }
}