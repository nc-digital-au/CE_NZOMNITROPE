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
import { AddressState, CarerModelDto, DeliveryModelDto, Gender, PatientModelDto, ProgramTermsAndConditionsModelDto, RegisterPspPatientWithDeliveryRequiredDto, RegistrationMethod, RegistrationServiceProxy, Title } from 'src/app/services/service-proxies/service-proxies';
import { InlineAlertComponent } from 'src/app/components/inline-alert/inline-alert.component';
import { ValidationProblemDetail } from 'src/app/interceptors/error.interceptor';
import { GuardianFormComponent } from './guardian-form/guardian-form.component';
import { PersonCollectingFormComponent } from './person-collecting-form/person-collecting-form.component';
import { MatError, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatInputModule } from '@angular/material/input';
import { RegisterPatientDetailsComponent } from './register-patient-details/register-patient-details.component';
import { MatProgressSpinner } from '@angular/material/progress-spinner'; 

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
    RegisterPatientDetailsComponent,
    MatProgressSpinner
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
  registrationSubmitted: boolean = false;
  submitting: boolean = false;
  emailInvalid: boolean = false;
  deliveryFormSubmitted = false;


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
          Validators.pattern(/^\d{4}$/),
        ],
      ],
      consent: [false, Validators.requiredTrue],
    });
  }

  get consentCtrl() {
    return this.barcodeForm?.get('consent');
  }

  get showConsentError(): boolean {
    const c = this.consentCtrl;
    return !!(c && c.invalid && (c.touched || this.barcodeFormSubmitted));
  }

  submitBarcodeValidation() {
    this.barcodeFormSubmitted = true;
    this.barcodeForm.markAllAsTouched();
    this.barcodeForm.updateValueAndValidity({ onlySelf: false, emitEvent: false });

    if (this.barcodeForm.invalid) {
      return;
    }

    const { barcode } = this.barcodeForm.value as any;
    this._registrationService.validateProductBarcode(barcode)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((response) => {
        if (response.isSuccess) {
          const validBarcode = response.resultObject;
          this.barcodeInvalid = !validBarcode;
          if (validBarcode) this.stepper.next();
        } else {
          this.barcodeForm.setErrors({ invalid: true });
          this.barcodeInvalid = true;
        }
      });
  }

  submitPatientDetailsForm(){
    const patientFormData = this.patientForm.value as any;
    this.patientForm.markAllAsTouched();
    this._registrationService.checkEmail(patientFormData.email)
      .pipe(
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe((response) => {
        if (response.isSuccess) {
          const emailUnique = response.resultObject;
          this.emailInvalid = !emailUnique;
          if (emailUnique) {
            this.patientForm.markAllAsTouched();
            if (this.patientForm.valid) {
              this.stepper.next();
            }
          }
        } else {
          this.emailInvalid = true;
        }
      });
  }

  submitGuardianForm(){
    const guardianFormData = this.guardianForm.value as any;
    this.guardianForm.markAllAsTouched();
    if (this.guardianForm.valid) {
      this.stepper.next();
    }
  }

  submitDeliveryForm() {
    this.deliveryFormSubmitted = true;

    this.collectingForm.markAllAsTouched();
    this.addressForm.markAllAsTouched();

    this.collectingForm.updateValueAndValidity({ emitEvent: false });
    this.addressForm.updateValueAndValidity({ emitEvent: false });

    if (this.collectingForm.valid && this.addressForm.valid) {
      this.stepper.next();
    }
  }

  onRegisterClick(): void {
    const dto = this.createDto();
    if (this.patientForm.valid && this.guardianForm.valid && this.addressForm.valid && this.termsForm.valid) {
      this.submitting = true;
      this._registrationService.registerPatientPspWithDelivery(dto)
      .pipe(
        takeUntilDestroyed(this._destroyRef),
      ).subscribe({
        next: (res) => {
          this.registrationSuccess = res.isSuccess;
          this.submitting = false;
          this.registrationSubmitted = true;
        },
        error: (err) => {
          this.registrationSuccess = false;
          this.registrationProblem = err.problemDetails;
          this.submitting = false;
          this.registrationSubmitted = true;
        },
      });
    }
  }

  private createDto(): RegisterPspPatientWithDeliveryRequiredDto {
    const patientData = this.patientForm.value as any;
    const guardianData = this.guardianForm.value as any;
    const collectingFormData = this.collectingForm.value as any;
    const addressData = this.addressForm.value as any;
    const termsData = this.termsForm.value as any;

    const barcodeData = this.barcodeForm.value as any;
    const patientDto = new PatientModelDto({
      barcode: barcodeData.barcode,
      isPrescriptionConfirmed: termsData.treatmentConfirmed,
      title: Title.Unknown,
      firstName: patientData.firstName,
      lastName: patientData.lastName,
      middleName: undefined,
      birthDay: undefined,
      birthYear: undefined,
      birthMonth: undefined,
      nationalHealthIndex: patientData.nhiNumber,
      medicareNumber: undefined,
      email: patientData.email,
      mobile: patientData.mobilePhone,
      password: patientData.password,
      phone: undefined,
      gender: Gender.NotSpecified
    });
    const carerDto = new CarerModelDto({
      firstName: guardianData.firstName,
      lastName: guardianData.lastName,
      email: guardianData.email,
      mobile: guardianData.mobilePhone,
      middleName: undefined,
      phone: undefined,
    });
    const addressDto = new DeliveryModelDto({
      delivetToName: collectingFormData.nameOfPersonCollecting,
      deliveryContactNumber: collectingFormData.contactNumber,
      unitNumber: addressData.unitNumber,
      streetAddress: addressData.streetAddress,
      city: addressData.city,
      postCode: addressData.postcode,
      state: AddressState.NA,
      deliveryInstructions: undefined,
      phone: collectingFormData.phone,
    }); 
    const termsDto = new ProgramTermsAndConditionsModelDto({
      privacyConsentProvided: termsData.privacyConsent,
      programTermsAgreed: termsData.termsAccepted,
      adverseEventContactConsentProvided: termsData.contactConsent,
      marketingCommunicationConsentProvided: false,
    });
    const dto = new RegisterPspPatientWithDeliveryRequiredDto({
      prescriberId: undefined,
      patientModel: patientDto,
      carerModel: carerDto,
      deliveryModel: addressDto,
      programTermsAndCondtionsModel: termsDto,
      registrationMethod: RegistrationMethod.PortalWebForm,
    });
    return dto;
  }

}
