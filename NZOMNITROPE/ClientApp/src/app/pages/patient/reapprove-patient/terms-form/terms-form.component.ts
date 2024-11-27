import { AfterViewInit, Component, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicFormComponent } from 'src/app/components/dynamic-form/dynamic-form.component';
import { DynamicForm } from 'src/app/components/dynamic-form/models/dynamic-form.model';
import { EligibilityCriteriaDialogComponent } from '../../eligibility-criteria/eligibility-criteria-dialog/eligibility-criteria-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { TitleFormElement } from 'src/app/components/dynamic-form/models/form-elements/title-form-element.model';

import { CheckboxFormInputElement } from 'src/app/components/dynamic-form/models/form-elements/checkbox-form-input-element.model';
@Component({
  selector: 'app-terms-form',
  standalone: true,
  imports: [
    DynamicFormComponent,
  ],
  templateUrl: './terms-form.component.html',
  styleUrl: './terms-form.component.scss'
})
export class TermsFormComponent implements AfterViewInit {
  @Output()
  formCreated = new EventEmitter<FormGroup>();

  formDefinition: DynamicForm;

  constructor(
    private _dialog: MatDialog,
  ) {
    this.buildForm();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      document.getElementsByClassName("eligibility-criteria")[0].addEventListener("click", (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        this._dialog.open(EligibilityCriteriaDialogComponent);
      });
    });
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
        name: 'meetsCriteria',
        label: 'My patient meets <a class="eligibility-criteria" href="#eligibility-criteria">eligibility criteria</a> for the Boehringer Ingelheim Medicines Request Program.',
        errorLabel: 'Criteria acceptance',
        validation: {
          required: true,
        },
      }),
      new CheckboxFormInputElement({
        name: 'maximumCriteria',
        label: 'I am aware that the maximum treatment period is 2 years from the first prescription.',
        errorLabel: 'Maximum acceptance',
        validation: {
          required: true,
        },
      }),
    ]);
  }
}