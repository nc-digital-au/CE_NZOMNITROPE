import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
export class GuardianFormComponent implements OnInit {
  @Output() formCreated = new EventEmitter<FormGroup>();
  
  guardianFormDefinition: DynamicForm;

  constructor() {
    this.buildForm();
  }
  ngOnInit(): void {
    
  }

  onFormCreated(form: FormGroup): void {
    this.formCreated.emit(form);
  }

  private buildForm(): void {
    this.guardianFormDefinition = new DynamicForm([
      new TitleFormElement({
        label: 'Guardian/Carer Details (if different from patient details)',
      }),
      new TextFormInputElement({
        name: 'firstName',
        label: 'First Name',
        validation: {
          required: false,
        },
      }),
      new TextFormInputElement({
        name: 'lastName',
        label: 'Last Name',
        validation: {
          required: false,
        },
      }),
      new TextFormInputElement({
        name: 'email',
        label: 'Email Address',
        validation: {
          required: false,
          email: true,
        },
      }),
      new TextFormInputElement({
        name: 'mobile',
        label: 'Mobile Phone',
        validation: {
          required: false,
        },
      }),
    ]);
  }
}
