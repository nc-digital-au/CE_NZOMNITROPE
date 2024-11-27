import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { ControlContainer, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { UI_DEFAULTS } from 'src/app/utils/constants';
import { Gender, Title } from 'src/app/utils/enums/ofev-data';
import { getErrorMessage } from 'src/app/utils/helpers/form-helper';
import { ageValidator } from 'src/app/utils/validators/age.validator';
import { requiredLengthValidator } from 'src/app/utils/validators/required-length.validator';
import { Patient, Prescriber } from '../../patient.model';

@Component({
  selector: 'app-personal-information',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  templateUrl: './personal-information.component.html',
  styleUrl: './personal-information.component.scss',
  viewProviders:[
    {
      provide: ControlContainer,
      useFactory:() => inject(ControlContainer, {skipSelf: true})
    }
  ],
})
export class PersonalInformationComponent {
  
  titleOptions: Title[] = [
    Title.Mr, Title.Mrs, Title.Ms, Title.Mx
  ];
  eGender = Gender;
  @Input({required:true}) controlKey = '';
  @Input({required:true}) submitted = false;
  @Input() patient?: Patient;
  
  parentContainer = inject(ControlContainer);
  get parentFormGroup(){
    return this.parentContainer.control as FormGroup;
  }

  patientForm = this.fb.nonNullable.group({
    title: [<Title | null> null, [Validators.required]],
    firstName: ['',[Validators.required, Validators.maxLength(UI_DEFAULTS.TEXT_INPUT_LIMIT)]],
    lastName: ['', [Validators.required, Validators.maxLength(UI_DEFAULTS.TEXT_INPUT_LIMIT)]],
    middleName:['', Validators.maxLength(UI_DEFAULTS.TEXT_INPUT_LIMIT)],
    dateOfBirth:[<Date|null> null, [Validators.required, ageValidator(18)]],
    gender: [<Gender|null>null,[Validators.required]],
  })

  constructor(private fb: FormBuilder){}

  ngOnInit(){
    this.parentFormGroup.addControl(this.controlKey, this.patientForm);
    if(this.patient){
      this.patientForm.patchValue(this.patient);
    }
  }

  ngOnDestroy(){
    this.parentFormGroup.removeControl(this.controlKey);
  }

  setErrorMessage = (form: FormGroup, formName: string, errorLabel: string) => getErrorMessage(form, formName, errorLabel);
}
