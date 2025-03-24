import { AfterViewInit, Component, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DynamicFormComponent } from 'src/app/components/dynamic-form/dynamic-form.component';
import { DynamicForm } from 'src/app/components/dynamic-form/models/dynamic-form.model';
import { CheckboxFormInputElement } from 'src/app/components/dynamic-form/models/form-elements/checkbox-form-input-element.model';
import { TitleFormElement } from 'src/app/components/dynamic-form/models/form-elements/title-form-element.model';
import { LeavingSiteDialog } from 'src/app/components/leaving-site/leaving-site.component';

@Component({
  selector: 'app-terms-form',
  standalone: true,
  imports: [
    DynamicFormComponent,
  ],
  templateUrl: './terms-form.component.html',
  styleUrl: './terms-form.component.scss'
})
export class TermsFormComponent{
  @Output()
  formCreated = new EventEmitter<FormGroup>();

  profileFormDefinition: DynamicForm;

  constructor(
    private _dialog: MatDialog,
  ) {
    this.buildForm();
  }

  onFormCreated(form: FormGroup): void {
    this.formCreated.emit(form);
  }

  private buildForm(): void {
    this.profileFormDefinition = new DynamicForm([
      new TitleFormElement({
        label: 'Agree to terms',
      }),
      new CheckboxFormInputElement({
        name: 'treatmentConfirmed',
        label: 'You are receiving Omnitrope® (somatropin) treatment in New Zealand.',
        errorLabel: 'Receive Policy acceptance',
        validation: {
          required: true,
        },
      }),
      new CheckboxFormInputElement({
        name: 'termsAccepted',
        label: 'You understand that you may withdraw from the program at any time. ',
        errorLabel: 'Withdraw Policy acceptance',
        validation: {
          required: true,
        },
      }),
      new CheckboxFormInputElement({
        name: 'informationConsent',
        label: 'You understand that to manage the program, your personal information will be accessed by the Program Administrators who will collect and store your information in accordance with the <a class="privacy-policy" href="#privacy-policy">privacy policy</a>.',
        errorLabel: 'Privacy Policy acceptance',
        validation: {
          required: true,
        },
      }),
      new CheckboxFormInputElement({
        name: 'privacyConsent',
        label: 'You have read, understand and agree to the <a class="privacy-policy" href="#privacy-policy">privacy policy</a>.',
        errorLabel: 'Privacy Policy acceptance',
        validation: {
          required: true,
        },
      }),
      new CheckboxFormInputElement({
        name: 'contactConsent',
        label: 'You consent to the Program Administrator contacting you with program reminders via email, or phone or SMS .',
        errorLabel: 'Contact Consent acceptance',
        validation: {
          required: true,
        },
      }),
    ]);
  }
}
