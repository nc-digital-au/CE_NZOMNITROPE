import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicFormComponent } from 'src/app/components/dynamic-form/dynamic-form.component';
import { DynamicForm } from 'src/app/components/dynamic-form/models/dynamic-form.model';
import { DateFormInputElement } from 'src/app/components/dynamic-form/models/form-elements/date-form-input-element.model';
import { GroupFormElement } from 'src/app/components/dynamic-form/models/form-elements/group-form-element.model';
import { SelectFormInputElement } from 'src/app/components/dynamic-form/models/form-elements/select-form-input-element.model';
import { TitleFormElement } from 'src/app/components/dynamic-form/models/form-elements/title-form-element.model';

@Component({
  selector: 'app-injection-training-session',
  standalone: true,
  imports: [
    DynamicFormComponent
  ],
  templateUrl: './injection-training-session.component.html',
  styleUrl: './injection-training-session.component.scss'
})
export class InjectionTrainingSessionComponent {
  @Output() formCreated = new EventEmitter<FormGroup>();

  injectionFormDefinition: DynamicForm;

  ngOnInit(): void {
    this.buildForm();
  }

  onFormCreated(form: FormGroup): void {
    this.formCreated.emit(form);
  }

  private buildForm(): void {
    this.injectionFormDefinition = new DynamicForm([
      new TitleFormElement({
        label: 'To book a virtual injection training session, please enter a preferred date and time*',
      }),
      new DateFormInputElement({
        name: 'dateOfBirth',
        label: 'Date Of Birth',
        validation: {
          required: true,
        },
      }),
      new SelectFormInputElement({
        name: 'time',
        label: 'Time',
        options: [
          { value: 'morning', label: 'Morning' },
          { value: 'afternoon', label: 'Afternoon' },
          { value: 'evening', label: 'Evening' },
        ],
        validation: {
          required: true,
        },
      }),
    ]);
  }

}
