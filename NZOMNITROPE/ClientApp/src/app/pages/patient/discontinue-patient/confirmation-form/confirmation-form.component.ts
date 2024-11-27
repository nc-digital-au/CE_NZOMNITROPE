import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicFormComponent } from 'src/app/components/dynamic-form/dynamic-form.component';
import { DynamicForm } from 'src/app/components/dynamic-form/models/dynamic-form.model';
import { CheckboxFormInputElement } from 'src/app/components/dynamic-form/models/form-elements/checkbox-form-input-element.model';
import { DisplayFormElement } from 'src/app/components/dynamic-form/models/form-elements/display-form-element.model';
import { GroupFormElement } from 'src/app/components/dynamic-form/models/form-elements/group-form-element.model';
import { TitleFormElement } from 'src/app/components/dynamic-form/models/form-elements/title-form-element.model';
import { DynamicFormHelper } from 'src/app/components/dynamic-form/models/helpers/dynamic-form-helper.model';
import { GetPatientsForPrescriberResponse, Title } from 'src/app/services/service-proxies/service-proxies';
import { GenderLabel } from 'src/app/utils/enums/enum-label';

@Component({
  selector: 'app-confirmation-form',
  standalone: true,
  imports: [
    DynamicFormComponent,
  ],
  templateUrl: './confirmation-form.component.html',
  styleUrl: './confirmation-form.component.scss'
})
export class ConfirmationFormComponent implements OnInit {
  @Input({ required: true })
  patient: GetPatientsForPrescriberResponse;
  
  @Output()
  formCreated = new EventEmitter<FormGroup>();

  formDefinition: DynamicForm;

  ngOnInit(): void {
    this.buildForm();
  }

  onFormCreated(form: FormGroup): void {
    this.formCreated.emit(form);
  }

  private buildForm(): void {
    this.formDefinition = new DynamicForm([
      new TitleFormElement({
        label: 'Patient details',
      }),
      new GroupFormElement({
        children: [
          new DisplayFormElement({
            label: 'Patient',
            data: `${Title[this.patient.title]} ${this.patient.firstName} ${this.patient.lastName}`,
          }),
          undefined,
        ],
      }),
      new GroupFormElement({
        children: [
          new DisplayFormElement({
            label: 'Date of birth',
            data: DynamicFormHelper.formatDate(this.patient.dateOfBirth),
          }),
          new DisplayFormElement({
            label: 'Gender',
            data: GenderLabel[this.patient.gender],
          }),
        ],
      }),
      new TitleFormElement({
        label: 'I confirm the following',
      }),
      new CheckboxFormInputElement({
        name: 'agreePatientAssesed',
        label: 'Patient has been assessed and I wish to discontinue treatment through the Boehringer Ingelheim Medicines Request Program.',
        errorLabel: 'Acceptance of patient assessment',
        validation: {
          required: true,
        },
      }),
      new CheckboxFormInputElement({
        name: 'carerInformedOfCessationAcceptance',
        label: 'Patient has been informed of cessation of supply of OFEV® through this Program.',
        errorLabel: 'Patient informed of cessation acceptance',
        validation: {
          required: true,
        },
      }),
      new CheckboxFormInputElement({
        name: 'patientToReturnedUnusedMedicationAcceptance',
        label: 'Patient has been advised to return any unused medication to their local pharmacy for disposal.',
        errorLabel: 'Patient to return unsed medication acceptance',
        validation: {
          required: true,
        },
      }),
    ]);
  }
}