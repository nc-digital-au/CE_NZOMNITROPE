import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { ControlContainer, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { getErrorMessage } from 'src/app/utils/helpers/form-helper';
import { Dosage, RepeatOption } from 'src/app/utils/enums/ofev-data';

@Component({
  selector: 'app-recommended-prescription',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  templateUrl: './recommended-prescription.component.html',
  styleUrl: './recommended-prescription.component.scss',
  viewProviders:[
    {
      provide: ControlContainer,
      useFactory:() => inject(ControlContainer, {skipSelf: true})
    }
  ],
})
export class RecommendedPrescriptionComponent {
  eDosage = Dosage;
  @Input({required:true}) controlKey = '';
  @Input({required: true}) repeatOptions!: RepeatOption[];
  @Input({required:true}) submitted = false;

  parentContainer = inject(ControlContainer);
  get parentFormGroup(){
    return this.parentContainer.control as FormGroup;
  }

  prescriptionForm = this.fb.nonNullable.group({
    dose:[<Dosage|null> null, [Validators.required]],
    repeats: [<RepeatOption|null>null, [Validators.required]],
    instructions: ['', [Validators.maxLength(250)]]
  })

  constructor(private fb: FormBuilder){}

  ngOnInit(){
    this.parentFormGroup.addControl(this.controlKey, this.prescriptionForm);
  }

  ngOnDestroy(){
    this.parentFormGroup.removeControl(this.controlKey);
  }

  setErrorMessage = (formName: string, errorLabel: string) => getErrorMessage(this.prescriptionForm, formName, errorLabel);

}
