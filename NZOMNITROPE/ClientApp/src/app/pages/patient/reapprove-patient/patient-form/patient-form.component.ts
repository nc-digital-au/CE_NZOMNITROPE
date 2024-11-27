import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicFormComponent } from 'src/app/components/dynamic-form/dynamic-form.component';
import { DynamicForm } from 'src/app/components/dynamic-form/models/dynamic-form.model';
import { DisplayFormElement } from 'src/app/components/dynamic-form/models/form-elements/display-form-element.model';
import { GroupFormElement } from 'src/app/components/dynamic-form/models/form-elements/group-form-element.model';
import { TextFormInputElement } from 'src/app/components/dynamic-form/models/form-elements/text-form-input-element.model';
import { TitleFormElement } from 'src/app/components/dynamic-form/models/form-elements/title-form-element.model';
import { DynamicFormHelper } from 'src/app/components/dynamic-form/models/helpers/dynamic-form-helper.model';
import { GetPatientsForPrescriberResponse, PrescriberServiceProxy, Title } from 'src/app/services/service-proxies/service-proxies';
import { GenderLabel } from 'src/app/utils/enums/enum-label';
import { PrescriberValidator } from 'src/app/utils/validators/prescriber.validator';

@Component({
  selector: 'app-patient-form',
  standalone: true,
  imports: [
    DynamicFormComponent,
  ],
  templateUrl: './patient-form.component.html',
  styleUrl: './patient-form.component.scss',
})
export class PatientFormComponent implements OnInit {
  @Input({ required: true })
  patient: GetPatientsForPrescriberResponse;

  @Output()
  formCreated = new EventEmitter<FormGroup>();

  formDefinition: DynamicForm;

  constructor(
    private readonly _prescriberService: PrescriberServiceProxy,
  ) {
  }

  ngOnInit(): void {
    this.buildForm();
  }

  onFormCreated(form: FormGroup): void {
    this.formCreated.emit(form);
  }

  private buildForm(): void {
    this.formDefinition = new DynamicForm([
      new GroupFormElement({
        children: [
          // TODO: prefill prescriber number if available
          // TODO: disable prescriber number if prefilled
          new TextFormInputElement({
            name: 'prescriberNumber',
            label: 'Prescriber number',
            value: this.patient.prescriberNumber,
            disabled: !!this.patient.prescriberNumber,
            validation: {
              required: true,
              prescriberNumber: true,
              numbersOnly: true,
              maxLength: PrescriberValidator.PRESCRIBER_NUMBER_MAX_LENGTH,
              customAsync: [
                PrescriberValidator.prescriberNumberUnique(this._prescriberService),
              ],
            },
          }),
          undefined,
        ],
      }),
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
      new GroupFormElement({
        children: [
          new TextFormInputElement({
            name: 'phone',
            label: 'Phone number',
            value: this.patient.phone,
            validation: {
              phone: true,
            },
          }),
          new TextFormInputElement({
            name: 'mobile',
            label: 'Mobile number',
            value: this.patient.mobile,
            validation: {
              mobile: true,
            },
          }),
        ],
        options: {
          requireAtLeastOne: true,
          requireAtLeastOneMessage: 'Please provide at least one contact number',
        },
      }),
    ]);
  }
}