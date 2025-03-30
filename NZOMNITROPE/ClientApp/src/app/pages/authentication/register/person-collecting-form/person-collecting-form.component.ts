import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicForm } from 'src/app/components/dynamic-form/models/dynamic-form.model';
import { DynamicFormComponent } from 'src/app/components/dynamic-form/dynamic-form.component';
import { TextFormInputElement } from 'src/app/components/dynamic-form/models/form-elements/text-form-input-element.model';
import { TitleFormElement } from 'src/app/components/dynamic-form/models/form-elements/title-form-element.model';

@Component({
  selector: 'app-person-collecting-form',
  standalone: true,
  imports: [DynamicFormComponent],
  templateUrl: './person-collecting-form.component.html',
  styleUrls: ['./person-collecting-form.component.scss'],
})
export class PersonCollectingFormComponent {
  @Output() formCreated = new EventEmitter<FormGroup>();

  personCollectingFormDefinition: DynamicForm;

  constructor() {
    this.buildForm();
  }

  private buildForm(): void {
    this.personCollectingFormDefinition = new DynamicForm([
      new TitleFormElement({
        label: 'Person Collecting Delivery',
      }),
      new TextFormInputElement({
        name: 'nameOfPersonCollecting',
        label: 'Name of Person Collecting the Delivery',
        validation: {
          required: true,
          maxLength: 100,
        },
      }),
      new TextFormInputElement({
        name: 'contactNumber',
        label: 'Contact Number',
        validation: {
          required: true,
        },
      }),
    ]);
  }

  onFormCreated(form: FormGroup): void {
    this.formCreated.emit(form);
  }
}
