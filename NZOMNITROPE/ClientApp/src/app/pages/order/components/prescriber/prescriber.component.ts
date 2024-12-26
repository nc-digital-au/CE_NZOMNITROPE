import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { ControlContainer, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { Prescriber } from '../../patient.model';
import { requiredLengthValidator } from 'src/app/utils/validators/required-length.validator';
import { getErrorMessage } from 'src/app/utils/helpers/form-helper';
import { PrescriberService } from 'src/app/services/prescriber.service';

@Component({
  selector: 'app-prescriber',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  templateUrl: './prescriber.component.html',
  styleUrl: './prescriber.component.scss',
  viewProviders:[
    {
      provide: ControlContainer,
      useFactory:() => inject(ControlContainer, {skipSelf: true})
    }
  ],
})
export class PrescriberComponent {

  @Input({required:true}) controlKey = '';
  @Input({required:true}) submitted = false;
  prescriber!: Prescriber;
  parentContainer = inject(ControlContainer);
  get parentFormGroup(){
    return this.parentContainer.control as FormGroup;
  }

  prescriberForm = this.fb.nonNullable.group({
    id: [''],
    name: [''],
    prescriberNumber: ['',[Validators.required, requiredLengthValidator(7)]],
    clinicName: [''],
    phoneNumber: ['']
  });

  constructor(
    private fb: FormBuilder,
    private prescriberSvc: PrescriberService
  ){}

  ngOnInit(){
    this.parentFormGroup.addControl(this.controlKey, this.prescriberForm);
    this.prescriber = this.prescriberSvc.getPrescriber();
    if(this.prescriber){
      this.prescriberForm.patchValue(this.prescriber);
    }
  }

  ngOnDestroy(){
    this.parentFormGroup.removeControl(this.controlKey);
  }

  get prescriberCtrl(){
    return this.prescriberForm.controls.prescriberNumber;
  }

  setErrorMessage = (ctrlName: string, errorLabel: string) => getErrorMessage(this.prescriberForm, ctrlName, errorLabel);

}
