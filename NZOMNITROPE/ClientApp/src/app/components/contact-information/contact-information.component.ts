import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { ControlContainer, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { getErrorMessage } from 'src/app/utils/helpers/form-helper';
import { ValidateMobile } from 'src/app/utils/validators/mobile.validator';
import { oneRequired } from 'src/app/utils/validators/one-required.validator';
import { ValidatePhone } from 'src/app/utils/validators/phone.validator';
import { ContactInformation } from './contact-information.model';

@Component({
  selector: 'app-contact-information',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  templateUrl: './contact-information.component.html',
  styleUrl: './contact-information.component.scss',
  viewProviders:[
    {
      provide: ControlContainer,
      useFactory:() => inject(ControlContainer, {skipSelf: true})
    }
  ],
})
export class ContactInformationComponent {
  @Input({required: true}) controlKey = '';
  @Input({required:true}) submitted!: boolean;

  @Input() contactInformation?: ContactInformation;
  @Input() emailRequired = true;
  @Input() showEmail = true;
  @Input() contactNumberRequired = false;

  parentContainer = inject(ControlContainer);
    get parentFormGroup(){
      return this.parentContainer.control as FormGroup;
    }

    contactInfo = this.fb.nonNullable.group({
      email: ['', [Validators.email, Validators.maxLength(50)]],
      phone: ['', [ValidatePhone]],
      mobile: ['', [ValidateMobile]]
    });

  constructor(private fb: FormBuilder){}

  ngOnInit(){
    this.parentFormGroup.addControl(this.controlKey, this.contactInfo);
    this.setRequiredValidations();
    if(this.contactInformation){
      this.contactInfo.patchValue(this.contactInformation);
    }
  }

  ngOnDestroy(){
    this.parentFormGroup.removeControl(this.controlKey);
  }

  setRequiredValidations(){
    if(this.emailRequired){
      this.email.addValidators(Validators.required);
    }

    if(this.contactNumberRequired){
      this.contactInfo.addValidators(oneRequired(['phone','mobile']));
    }

  }

 removeRequiredValidation(controls: FormControl[]){
    controls.forEach(control => {
      if(control.hasValidator(Validators.required))
        {
          control.removeValidators(Validators.required);
          control.updateValueAndValidity();
        }
    });
  }
  
  addRequiredValidation(controls: FormControl[]){
    controls.forEach(control => {
      if(!control.hasValidator(Validators.required))
        {
          control.addValidators(Validators.required);
          control.updateValueAndValidity();
        }
    });
  }

  setErrorMessage = (formName: string, errorLabel: string) => getErrorMessage(this.contactInfo, formName, errorLabel);
  
  setInvalidControlForFormValidation(){
    if(this.contactInfo.errors?.['requiredOne']){
      this.phone.setErrors({invalid: true});
      this.mobile.setErrors({invalid: true});
    }

  }

  get contactForm(){
    return this.contactInfo;
  }
  get email(){
    return this.contactInfo.controls.email;
  }
  get phone(){
    return this.contactInfo.controls.phone;
  }
  get mobile(){
    return this.contactInfo.controls.mobile;
  }
}
