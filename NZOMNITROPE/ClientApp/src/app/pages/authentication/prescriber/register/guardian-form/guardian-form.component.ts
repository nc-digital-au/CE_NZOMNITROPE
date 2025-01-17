import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicForm } from 'src/app/components/dynamic-form/models/dynamic-form.model';
import { DynamicFormComponent } from 'src/app/components/dynamic-form/dynamic-form.component';
import { TextFormInputElement } from 'src/app/components/dynamic-form/models/form-elements/text-form-input-element.model';
import { TitleFormElement } from 'src/app/components/dynamic-form/models/form-elements/title-form-element.model';

@Component({
  selector: 'app-guardian-form',
  standalone: true,
  imports: [
    DynamicFormComponent,

  ],
  templateUrl: './guardian-form.component.html',
  styleUrls: ['./guardian-form.component.scss'],
})
export class GuardianFormComponent {
  @Output() formCreated = new EventEmitter<FormGroup>();
  
  guardianFormDefinition: DynamicForm;

  constructor() {
    this.buildForm();
  }

  onFormCreated(form: FormGroup): void {
    this.formCreated.emit(form);
  }

  private buildForm(): void {
    this.guardianFormDefinition = new DynamicForm([
      new TitleFormElement({
        label: 'Guardian/Carer Details',
      }),
      new TextFormInputElement({
        name: 'guardianFirstName',
        label: 'First Name',
        validation: {
          required: false,
        },
      }),
      new TextFormInputElement({
        name: 'guardianLastName',
        label: 'Last Name',
        validation: {
          required: false,
        },
      }),
      new TextFormInputElement({
        name: 'guardianEmail',
        label: 'Email Address',
        validation: {
          required: false,
          email: true,
        },
      }),
      new TextFormInputElement({
        name: 'guardianMobile',
        label: 'Mobile Phone',
        validation: {
          required: false,
        },
      }),
    ]);
  }
}
