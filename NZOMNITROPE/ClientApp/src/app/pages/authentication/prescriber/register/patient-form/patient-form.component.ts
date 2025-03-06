import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicForm } from 'src/app/components/dynamic-form/models/dynamic-form.model';
import { DynamicFormComponent } from 'src/app/components/dynamic-form/dynamic-form.component';
import { GroupFormElement } from 'src/app/components/dynamic-form/models/form-elements/group-form-element.model';
import { SelectFormInputElement } from 'src/app/components/dynamic-form/models/form-elements/select-form-input-element.model';
import { TextFormInputElement } from 'src/app/components/dynamic-form/models/form-elements/text-form-input-element.model';
import { TitleFormElement } from 'src/app/components/dynamic-form/models/form-elements/title-form-element.model';
import { PrescriberValidator } from 'src/app/utils/validators/prescriber.validator';
import { CheckboxFormInputElement } from 'src/app/components/dynamic-form/models/form-elements/checkbox-form-input-element.model';

@Component({
  selector: 'app-patient-form',
  standalone: true,
  imports: [
    DynamicFormComponent,
  ],
  templateUrl: './patient-form.component.html',
  styleUrls: ['./patient-form.component.scss'],
})
export class PatientFormComponent implements OnInit {
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
          // pattern: /^\d{10}$/, // Example: 10-digit number
        },
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
