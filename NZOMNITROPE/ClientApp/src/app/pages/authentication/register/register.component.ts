import { BreakpointObserver } from '@angular/cdk/layout';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, DestroyRef, EventEmitter, inject, OnInit, Output, ViewChild } from '@angular/core';
import { ControlContainer, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatStep, MatStepLabel, MatStepper, MatStepperNext, MatStepperPrevious, StepperOrientation } from '@angular/material/stepper';
import { map, Observable, tap } from 'rxjs';
import { MatButton } from '@angular/material/button';
import { TermsFormComponent } from './terms-form/terms-form.component';
import { RouterLink } from '@angular/router';
import { routeLinks } from 'src/app/utils/routes';
import { AddressComponent } from 'src/app/components/address/address.component';
import { RegisterPspPatientWithDeliveryRequiredDto, RegistrationServiceProxy, Title } from 'src/app/services/service-proxies/service-proxies';
import { InlineAlertComponent } from 'src/app/components/inline-alert/inline-alert.component';
import { ValidationProblemDetail } from 'src/app/interceptors/error.interceptor';
import { GuardianFormComponent } from './guardian-form/guardian-form.component';
import { PersonCollectingFormComponent } from './person-collecting-form/person-collecting-form.component';
import { MatError, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatInputModule } from '@angular/material/input';
import { RegisterPatientDetailsComponent } from './register-patient-details/register-patient-details.component';

@Component({
  selector: 'app-register',
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
    TermsFormComponent,
    AddressComponent,
    InlineAlertComponent,
    GuardianFormComponent,
    PersonCollectingFormComponent,
    MatError,
    MatCheckboxModule,
    MatInputModule,
    MatLabel,
    MatFormFieldModule,
    MatCardHeader,
    MatCardTitle,
    ReactiveFormsModule,
    CommonModule,
    RegisterPatientDetailsComponent
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true })
    },
  ],
})
export class RegisterComponent implements OnInit {

  @ViewChild('stepper')
  stepper: MatStepper;

  routeLinks = routeLinks;
  stepperOrientation$: Observable<StepperOrientation>;
  barcodeFormSubmitted: boolean = false;
  barcodeInvalid: boolean = false;

  patientForm = this._fb.group({});
  guardianForm = this._fb.group({});
  collectingForm = this._fb.group({});
  addressForm = this._fb.group({});
  termsForm = this._fb.group({});
  barcodeForm: FormGroup;
  
  registrationSuccess: boolean;
  registrationProblem: ValidationProblemDetail;
  
  private _destroyRef = inject(DestroyRef);

  constructor(
    private _breakpointObserver: BreakpointObserver,
    private _fb: FormBuilder,
    private _registrationService: RegistrationServiceProxy,
  ) {
    this.stepperOrientation$ = this._breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }

  ngOnInit(): void {
    this.buildBarcodeForm();
  }

  private buildBarcodeForm(): void {
    this.barcodeForm = this._fb.group({
      barcode: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d{4}$/), // Ensure it's exactly 4 digits
        ],
      ],
      consent: [false, Validators.requiredTrue], // Checkbox for consent
    });
  }

  submitBarcodeValidation() {
    this.barcodeForm.markAllAsTouched();
    const barcodeFormData = this.barcodeForm.value as any;
    if (this.barcodeForm.valid) {
      const barcode = barcodeFormData.barcode;
      this._registrationService.validateProductBarcode(barcode)
        .pipe(
          takeUntilDestroyed(this._destroyRef),
        )
        .subscribe((response) => 
          {
           if (response.isSuccess) {
            const validBarcode = response.resultObject;
            this.barcodeInvalid = !validBarcode;
            if (validBarcode){
              this.stepper.next();
            }
           } else {
            this.barcodeForm.setErrors({ invalid: true });
           }
           this.barcodeFormSubmitted = true;
        }
      );
    }
  }

  submitPatientDetailsForm(){
    const patientFormData = this.patientForm.value as any;
    this.patientForm.markAllAsTouched();
    if (this.patientForm.valid) {
      this.stepper.next();
    }
  }

  submitGuardianForm(){
    const guardianFormData = this.guardianForm.value as any;
    console.log(guardianFormData);
    this.guardianForm.markAllAsTouched();
    if (this.guardianForm.valid) {
      this.stepper.next();
    }
  }

  submitDeliveryForm(){
    const collectingFormData = this.collectingForm.value as any;
    console.log(collectingFormData);
    this.collectingForm.markAllAsTouched();
    if (this.collectingForm.valid) {
      this.stepper.next();
    }
  }
  onRegisterClick(): void {
    // const dto = this.createDto();
    // if (this.patientForm.valid && this.guardianForm.valid && this.addressForm.valid && this.termsForm.valid) {
    //   this._registrationService.registerPatientPspWithDelivery(new RegisterPrescriberDto({
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
  }

  // private createDto(): RegisterPspPatientWithDeliveryRequiredDto {
  //   const patientData = this.patientForm.value as any;
  //   const guardianData = this.guardianForm.value as any;
  //   const collectingFormData = this.collectingForm.value as any;
  //   const addressData = this.addressForm.value as any;
  //   const termsData = this.termsForm.value as any;
  //   const barcodeData = this.barcodeForm.value as any;
  //   const dto = new RegisterPspPatientWithDeliveryRequiredDto({
  //     patientModel: {
  //       barcode: barcodeData.barcode,
  //       isPrescriptionConfirmed: true,
  //       title: Title.Unknown,
  //       firstName: patientData.firstName,
  //       lastName: patientData.lastName,
  //       middleName: undefined,
  //       birthDay: undefined,
  //       birthYear: undefined,
  //       birthMonth: undefined,
  //       medicalReferenceNumber: patientData.nhiNumber,
  //       email: patientData.email,
  //       mobile: patientData.mobilePhone,
  //       password: patientData.password,
  //       phone: undefined,
  //     },
  //     carerModel: {
  //       firstName: guardianData.firstName,
  //       lastName: guardianData.lastName,
  //       email: guardianData.email,
  //       mobile: guardianData.mobilePhone,
  //       middleName: undefined,
  //       phone: undefined,
  //     },
  //     deliveryModel: {
  //       delivetToName: collectingFormData.firstName + ' ' + collectingFormData.lastName,
  //       deliveryContactNumber: collectingFormData.mobilePhone,
  //       unitNumber: addressData.unitNumber,
  //       streetAddress: addressData.streetAddress,
  //       city: addressData.city,
  //       postCode: addressData.postcode,
  //       state: addressData.state,
  //       deliveryInstructions: undefined,
  //       phone: collectingFormData.phone,
  //     },
  //     programTerms: termsData.programTerms,
  //     privacyConsent: termsData.privacyConsent,
  //     adverseEventContactConsent: termsData.adverseEventContactConsent,
  //     contactConsent: termsData.contactConsent,
  //     marketingCommunicationConsent: termsData.marketingCommunicationConsent,
  //   });
  //   return dto;
  // }
}
