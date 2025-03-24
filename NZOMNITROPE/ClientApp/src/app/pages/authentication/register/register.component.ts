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
import { GetRegistrationStatusRepsonse, RegistrationServiceProxy } from 'src/app/services/service-proxies/service-proxies';
import { InlineAlertComponent } from 'src/app/components/inline-alert/inline-alert.component';
import { ValidationProblemDetail } from 'src/app/interceptors/error.interceptor';
import { PatientFormComponent } from './patient-form/patient-form.component';
import { GuardianFormComponent } from './guardian-form/guardian-form.component';
import { PersonCollectingFormComponent } from './person-collecting-form/person-collecting-form.component';
import { MatError, MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatCheckbox } from '@angular/material/checkbox';
import { DynamicForm } from 'src/app/components/dynamic-form/models/dynamic-form.model';
import { TextFormInputElement } from 'src/app/components/dynamic-form/models/form-elements/text-form-input-element.model';
import { TitleFormElement } from 'src/app/components/dynamic-form/models/form-elements/title-form-element.model';
import { ValidateMobile } from 'src/app/utils/validators/mobile.validator';
import { GroupFormElement } from 'src/app/components/dynamic-form/models/form-elements/group-form-element.model';
import { CheckboxFormInputElement } from 'src/app/components/dynamic-form/models/form-elements/checkbox-form-input-element.model';
import { DynamicFormComponent } from 'src/app/components/dynamic-form/dynamic-form.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
    PatientFormComponent,
    GuardianFormComponent,
    PersonCollectingFormComponent,
    MatError,
    MatCheckbox,
    MatLabel,
    MatFormFieldModule,
    MatCardHeader,
    MatCardTitle,
    ReactiveFormsModule,
    CommonModule,
    DynamicFormComponent
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

  barcodeForm = this._fb.group({});
  barcodeFormDefinition: DynamicForm;
  patientForm = this._fb.group({});
  guardianForm = this._fb.group({});
  collectingForm = this._fb.group({});
  addressForm = this._fb.group({});
  termsForm = this._fb.group({});

  isBarcodeValid: boolean = false;

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
    this.barcodeFormDefinition = new DynamicForm([
      new GroupFormElement({
        children: [
          new TextFormInputElement({
            name: 'barcode',
            label: 'Barcode',
            validation: {
              required: true,
              pattern: '/^\d{4}$/',
            },
          }),
        ]
      }),
      new CheckboxFormInputElement({
        name: 'confirm',
        label: `I confirm that I have been prescribed Omnitrope® (somatropin).`,
        errorLabel: 'Confirmation',
        validation: {
          required: true, 
        },
      }),
    ]);
  }

  submitBarcodeValidation() {
    this.barcodeForm.markAllAsTouched();
    const barcodeFormData = this.barcodeForm.value as any;
    if (this.barcodeForm.valid) {
      const barcode = barcodeFormData.barcode;
      console.log('Barcode:', barcode);
      this._registrationService.validateProductBarcode(barcode)
        .pipe(
          takeUntilDestroyed(this._destroyRef),
        )
        .subscribe((response) => {
           if (response.isSuccess && response.resultObject === true) {
            this.isBarcodeValid = true;
            this.stepper.next();
           } else {
            this.barcodeForm.setErrors({ invalid: true });
           }
        }
      );
    }
}
  
  onRegisterClick(): void {
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
  }
}
