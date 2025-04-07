import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicFormComponent } from 'src/app/components/dynamic-form/dynamic-form.component';
import { DynamicForm } from 'src/app/components/dynamic-form/models/dynamic-form.model';
import { TextFormInputElement } from 'src/app/components/dynamic-form/models/form-elements/text-form-input-element.model';
import { TitleFormElement } from 'src/app/components/dynamic-form/models/form-elements/title-form-element.model';
import { ValidateMobile } from 'src/app/utils/validators/mobile.validator';

@Component({
  selector: 'app-register-patient-details',
  standalone: true,
  imports: [DynamicFormComponent],
  templateUrl: './register-patient-details.component.html',
  styleUrl: './register-patient-details.component.scss'
})
export class RegisterPatientDetailsComponent {
  @Output() formCreated = new EventEmitter<FormGroup>();

  patientFormDefinition: DynamicForm;

  ngOnInit(): void {
    this.buildForm();
  }

  onFormCreated(form: FormGroup): void {
    this.formCreated.emit(form);
  }

  private buildForm(): void {
    this.patientFormDefinition = new DynamicForm([
      new TitleFormElement({
        label: 'Patient Details',
      }),
      new TextFormInputElement({
        name: 'firstName',
        label: 'First Name',
        validation: {
          required: true,
          maxLength: 50,
        },
      }),
      new TextFormInputElement({
        name: 'lastName',
        label: 'Last Name',
        validation: {
          required: true,
          maxLength: 50,
        },
      }),
      new TextFormInputElement({
        name: 'nhiNumber',
        label: 'NHI Number (if known)',
        validation: {
          required: false,
          nhi: true,
        },
      }),
      new TextFormInputElement({
        name: 'email',
        label: 'Email Address',
        validation: {
          required: true,
          email: true,
        },
      }),
      new TextFormInputElement({
        name: 'mobilePhone',
        label: 'Mobile Phone',
        validation: {
          required: true,
          custom: [ValidateMobile]
        }
      }),
      new TextFormInputElement({
        name: 'password',
        label: 'Password',
        validation: {
          required: true,
          password: true,
          minLength: 8,
          custom: [
            // PrescriberValidator.passwordFormat,
          ],
        },
      }),
      new TextFormInputElement({
        name: 'confirmPassword',
        label: 'Confirm Password',
        validation: {
          required: true,
          password: true,
          minLength: 8,
          custom: [
            // PrescriberValidator.passwordFormat,
          ],
        },
      }),
    ]);
  }
}
