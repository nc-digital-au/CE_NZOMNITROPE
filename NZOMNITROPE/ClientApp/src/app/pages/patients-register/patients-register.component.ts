import { AsyncPipe } from '@angular/common';
import { Component, DestroyRef, inject, ViewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatStep, MatStepLabel, MatStepper, MatStepperNext, MatStepperPrevious, StepperOrientation } from '@angular/material/stepper';
import { RouterLink } from '@angular/router';
import { ProfileFormComponent } from '../authentication/prescriber/register/profile-form/profile-form.component';
import { TermsFormComponent } from '../patient/reapprove-patient/terms-form/terms-form.component';
import { SvgIconComponent } from 'angular-svg-icon';
import { AddressComponent } from 'src/app/components/address/address.component';
import { InlineAlertComponent } from 'src/app/components/inline-alert/inline-alert.component';
import { routeLinks } from 'src/app/utils/routes';
import { map, Observable } from 'rxjs';
import { ValidationProblemDetail } from 'src/app/interceptors/error.interceptor';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RegistrationServiceProxy } from 'src/app/services/service-proxies/service-proxies';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BreakpointObserver } from '@angular/cdk/layout';
import { RegisterFormComponent } from './register-form/register-form.component';
import { PatientDetailsComponent } from './patient-details/patient-details.component';
import { RegisterConfirmationComponent } from './register-confirmation/register-confirmation.component';
import { AddressInformationComponent } from 'src/app/components/address-information/address-information.component';
import { ageValidator } from 'src/app/utils/validators/age.validator';

@Component({
  selector: 'app-patients-register',
  standalone: true,
  imports: [
    MatStepper,
    MatStep,
    MatStepLabel,
    MatStepperPrevious,
    MatStepperNext,
    MatCard,
    MatCardContent,
    MatButton,
    AsyncPipe,
    RouterLink,
    ProfileFormComponent,
    TermsFormComponent,
    SvgIconComponent,
    AddressComponent,
    InlineAlertComponent,
    RegisterFormComponent,
    PatientDetailsComponent,
    RegisterConfirmationComponent,
    AddressInformationComponent
  ],
  templateUrl: './patients-register.component.html',
  styleUrl: './patients-register.component.scss'
})
export class PatientsRegisterComponent {
@ViewChild('stepper')
  stepper: MatStepper;
  routeLinks = routeLinks;
  stepperOrientation$: Observable<StepperOrientation>;

  registerForm = this.fb.group({
    barcode:['', Validators.required],
    consent: ['', Validators.required],
  });


  patientInfoForm = this.fb.group({
    title: ['', Validators.required],
    firstName: ['', [Validators.required, Validators.maxLength(30)]],
    lastName: ['', [Validators.required, Validators.maxLength(30)]],
    patientDob: [<Date|null> null, [Validators.required, ageValidator(18)]],
    nih: ['', Validators.required],
    specialty: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required],
    confirmPassword: ['', Validators.required],
  }, {
  });

  confirmationForm = this.fb.group({
    acknowledgment1: ['', Validators.required],
    acknowledgment2: ['', Validators.required],
    acknowledgment3: ['', Validators.required],
    acknowledgment4: ['', Validators.required],
    acknowledgment5: ['', Validators.required],
  });

  registrationSuccess: boolean;
  submitting = false;
  registrationProblem: ValidationProblemDetail;
  
  private _destroyRef = inject(DestroyRef);

  constructor(
      private _breakpointObserver: BreakpointObserver,
      private fb: FormBuilder,
      private _registrationService: RegistrationServiceProxy
    ) {
      this.stepperOrientation$ = this._breakpointObserver
        .observe('(min-width: 800px)')
        .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
    }
    
    onFormCreated(form: FormGroup, step: string): void {
      if (step === 'register') {
        this.registerForm = form;
      } else if (step === 'patient') {
        this.patientInfoForm = form;
      } else if (step === 'confirmation') {
        this.confirmationForm = form;
      }
    }

    onFormSubmit(): void {
      if (this.registerForm.valid && this.patientInfoForm.valid && this.confirmationForm.valid) {
        this.submitting = true;
        setTimeout(() => {
          this.submitting = false;
          this.registrationSuccess = true;
        }, 2000);
      } else {
        console.error('One or more forms are invalid');
      }
    }

    // private submitPharmacistRegistration(): void {
    //   this._registrationService.pharmacist(this.createRegisterPharmacistDto()).pipe(
    //     takeUntilDestroyed(this._destroyRef),
    //   ).subscribe({
    //     next: (res) => {
    //       this.registrationSuccess = res.isSuccess;
    //       this.stepper.next();
    //     },
    //     error: (err) => {
    //       this.registrationSuccess = false;
    //       this.registrationProblem = err.problemDetails;
    //       this.stepper.next();
    //     },
    //   });
    // } 
    
    // private createPatientsRegisterDto(): PatientsRegisterDto {
    //   const registerData = this.registerForm.value as any;
    //   const patientInfoData = this.patientInfoForm.value as any;
    //   const confirmationData = this.confirmationForm.value as any;

    //   return new PatientsRegisterDto({
    //     registrationMethod: RegistrationMethod.PortalWebForm,
    //     barcode: registerData.barcode,
    //     consent: registerData.consent,
    //     title: patientInfoData.title,
    //     firstName: patientInfoData.firstName,
    //     lastName: patientInfoData.lastName,
    //     patientDob: patientInfoData.patientDob,
    //     nih: patientInfoData.nih,
    //     specialty: patientInfoData.specialty,
    //     email: patientInfoData.email,
    //     password: patientInfoData.password,
    //     confirmPassword: patientInfoData.confirmPassword,
    //     acknowledgment1: confirmationData.acknowledgment1,
    //     acknowledgment2: confirmationData.acknowledgment2,
    //     acknowledgment3: confirmationData.acknowledgment3,
    //     acknowledgment4: confirmationData.acknowledgment4,
    //     acknowledgment5: confirmationData.acknowledgment5,
    //   });
    // }


    // onRegisterClick(): void {
      // if (this.profileForm.valid && this.contactForm.valid && this.termsForm.valid) {
      //   const profileData = this.profileForm.value as any;
      //   const contactData = this.contactForm.value as any;
      //   const termsData = this.termsForm.value as any;
        
      //   this._registrationService.prescriber(new RegisterPrescriberDto({
      //     registrationMethod: RegistrationMethod.PortalWebForm,
      //     title: profileData.title,
      //     firstName: profileData.firstName,
      //     lastName: profileData.lastName,
      //     email: profileData.email,
      //     username: profileData.email,
      //     ahpraNumber: profileData.ahpraNumber,
      //     specialty: Specialty.Other,
      //     specialtyOther: profileData.specialty,
      //     password: profileData.password,
      //     clinic: new ClinicDto({
      //       name: contactData.name,
      //       phone: contactData.phone,
      //       address: new AddressDto({
      //         unitNumber: contactData.unitNumber,
      //         city: contactData.city,
      //         addressLine1: contactData.streetAddress,
      //         addressLine2: undefined,
      //         postcode: contactData.postcode,
      //         state: contactData.state,
      //       }),
      //       email: undefined,
      //       fax: undefined,
      //       id: undefined,
      //       latitude: undefined,
      //       longitude: undefined,
      //     }),
      //     programTermsAgreed: termsData.programTerms,
      //     privacyConsentProvided: termsData.privacyConsent,
      //     adverseEventContactConsentProvided: termsData.adverseEventContactConsent,
      //     contactConsentProvided: termsData.contactConsent,
      //     marketingCommunicationConsentProvided: termsData.marketingCommunicationConsent,
      //     location: undefined,
      //     middleName: undefined,
      //     mobile: undefined,
      //     phone: undefined,
      //     prescriberNumber: undefined,
      //     registeredOn: undefined,
      //   })).pipe(
      //     takeUntilDestroyed(this._destroyRef),
      //   ).subscribe({
      //     next: (res) => {
      //       this.registrationSuccess = res.isSuccess;
      //       this.stepper.next();
      //     },
      //     error: (err) => {
      //       this.registrationSuccess = false;
      //       this.registrationProblem = err.problemDetails;
      //       this.stepper.next();
      //     },
      //   });
      // }
    // }
  }
  
