import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormGroupDirective } from '@angular/forms';
import { DynamicFormComponent } from 'src/app/components/dynamic-form/dynamic-form.component';
import { DynamicForm } from 'src/app/components/dynamic-form/models/dynamic-form.model';
import { RadioOption, RadioFormInputElement } from 'src/app/components/dynamic-form/models/form-elements/radio-form-input-element.model';
import { TitleFormElement } from 'src/app/components/dynamic-form/models/form-elements/title-form-element.model';
import { InlineAlertComponent } from 'src/app/components/inline-alert/inline-alert.component';
@Component({
  selector: 'app-eligibility-form',
  standalone: true,
  imports: [
    DynamicFormComponent,
    InlineAlertComponent,
  ],
  templateUrl: './eligibility-form.component.html',
  styleUrl: './eligibility-form.component.scss'
})
export class EligibilityFormComponent {
  @Output()
  formCreated = new EventEmitter<FormGroup>();

  formDefinition: DynamicForm;
  form: FormGroup<{}>;
  tempForm: FormGroupDirective;

  get allCriteriasAccepted(): boolean {
    if (this.form) {
      return this.form.controls['criteria1'].value
        && !this.form.controls['criteria2'].value
        && this.form.controls['criteria3'].value
        && this.form.controls['criteria4'].value;
    }
    return false;
  }

  constructor() {
    this.buildForm();
  }

  onFormCreated(form: FormGroup): void {
    this.form = form;
    this.formCreated.emit(form);
  }

  private buildForm(): void {
    const criteriaOptions: RadioOption[] = [
      {
        label: 'Yes',
        value: true,
      },
      {
        label: 'No',
        value: false,
      },
    ];

    this.formDefinition = new DynamicForm([
      new TitleFormElement({
        label: 'The patient meets the program eligibility criteria',
      }),
      new RadioFormInputElement({
        name: 'criteria1',
        label: 'Patient is on the transplant list',
        options: criteriaOptions,
        hideErrors: true,
        validation: {
          required: true,
        },
      }),
      new RadioFormInputElement({
        name: 'criteria2',
        label: 'Patient is elgibile for an ILD clinical trial',
        options: criteriaOptions,
        hideErrors: true,
        validation: {
          required: false,
        },
      }),
      new RadioFormInputElement({
        name: 'criteria3',
        label: 'MDT Consensus of advanced IPF/PF-ILD ',
        options: criteriaOptions,
        hideErrors: true,
        validation: {
          required: true,
        },
      }),
      new RadioFormInputElement({
        name: 'criteria4',
        label: 'MDT consensus to initiate OFEV to stabilise patient for transplant. ',
        options: criteriaOptions,
        hideErrors: true,
        validation: {
          required: true,
        },
      }),
    ]);
  }
}
