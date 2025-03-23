import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicForm } from 'src/app/components/dynamic-form/models/dynamic-form.model';
import { DynamicFormComponent } from 'src/app/components/dynamic-form/dynamic-form.component';
import { GroupFormElement } from 'src/app/components/dynamic-form/models/form-elements/group-form-element.model';
import { SelectFormInputElement } from 'src/app/components/dynamic-form/models/form-elements/select-form-input-element.model';
import { TextFormInputElement } from 'src/app/components/dynamic-form/models/form-elements/text-form-input-element.model';
import { TitleFormElement } from 'src/app/components/dynamic-form/models/form-elements/title-form-element.model';
import { DateFormInputElement } from '../dynamic-form/models/form-elements/date-form-input-element.model';
import { ValidateMobile } from 'src/app/utils/validators/mobile.validator';

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
        },
      }),
      new TextFormInputElement({
        name: 'nhiNumber',
        label: 'NHI Number (if known)',
        validation: {
          required: false,
        },
      }),
    ]);
  }
}
