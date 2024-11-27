import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DynamicFormComponent } from 'src/app/components/dynamic-form/dynamic-form.component';
import { DynamicForm } from 'src/app/components/dynamic-form/models/dynamic-form.model';
import { CheckboxFormInputElement } from 'src/app/components/dynamic-form/models/form-elements/checkbox-form-input-element.model';
import { TitleFormElement } from 'src/app/components/dynamic-form/models/form-elements/title-form-element.model';
import { CONTACT_VALUES } from 'src/app/utils/constants';
import { EligibilityCriteriaDialogComponent } from '../../eligibility-criteria/eligibility-criteria-dialog/eligibility-criteria-dialog.component';
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
      
      document.getElementsByClassName("bi-privacy")[0].addEventListener("click", (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        this._dialog.open(LeavingSiteDialog, {
          data: {
            url: CONTACT_VALUES.BI_PRIVACY_POLICY_LINK,
          }
        })
      });
      
      document.getElementsByClassName("consent-form")[0].addEventListener("click", (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
      });
    });
  }

  onFormCreated(form: FormGroup): void {
    this.formCreated.emit(form);
  }

  private buildForm(): void {
    this.formDefinition = new DynamicForm([
      new TitleFormElement({
        label: 'I agree to the following',
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
        name: 'privacyConsent',
        label: 'Patient has consented to their personal information being provided by me (their doctor) for the purpose of administering the Program as described in the <a class="bi-privacy" href="#bi-privacy">Privacy Policy</a>.',
        errorLabel: 'Privacy Consent acceptance',
        validation: {
          required: true,
        },
      }),
      new CheckboxFormInputElement({
        name: 'carerConsent',
        label: 'Patient has read and signed the Boehringer Ingelheim Medicines Request Program <a class="consent-form" href="#consent-form">Consent Form</a>, and a photocopy of the signed form has been provided to the patient and the original kept by me (their doctor) in the patient\'s medical record.',
        errorLabel: 'Patient Consent acceptance',
        validation: {
          required: true,
        },
      }),
      new CheckboxFormInputElement({
        name: 'voluntaryConsent',
        label: 'Patient understands that enrolment in the Program is voluntary and that they may withdraw from the Program at any time by informing me, as their doctor.',
        errorLabel: 'Voluntary Widthdrawal acceptance',
        validation: {
          required: true,
        },
      }),
      new CheckboxFormInputElement({
        name: 'mandatoryConsent',
        label: 'I understand that once OFEV is approved and supplied, OFEV will be provided for a maximum duration of two years.',
        errorLabel: 'Voluntary Widthdrawal acceptance',
        validation: {
          required: true,
        },
      }),
    ]);
  }
}