import { BreakpointObserver } from '@angular/cdk/layout';
import { AsyncPipe } from '@angular/common';
import { Component, DestroyRef, inject, ViewChild } from '@angular/core';
import { ControlContainer, FormBuilder } from '@angular/forms';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatStep, MatStepLabel, MatStepper, MatStepperNext, MatStepperPrevious, StepperOrientation } from '@angular/material/stepper';
import { map, Observable } from 'rxjs';
import { WelcomeFormComponent } from './welcome-form/welcome-form.component';
import { MatButton } from '@angular/material/button';
import { TermsFormComponent } from './terms-form/terms-form.component';
import { RouterLink } from '@angular/router';
import { routeLinks } from 'src/app/utils/routes';
import { AddressComponent } from 'src/app/components/address/address.component';
import { AddressDto, ClinicDto, RegisterPrescriberDto, RegistrationMethod, RegistrationServiceProxy, Specialty } from 'src/app/services/service-proxies/service-proxies';
import { InlineAlertComponent } from 'src/app/components/inline-alert/inline-alert.component';
import { ValidationProblemDetail } from 'src/app/interceptors/error.interceptor';
import { PatientFormComponent } from './patient-form/patient-form.component';

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
    WelcomeFormComponent,
    TermsFormComponent,
    AddressComponent,
    InlineAlertComponent,
    PatientFormComponent,
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
export class RegisterComponent {
  @ViewChild('stepper')
  stepper: MatStepper;

  routeLinks = routeLinks;
  stepperOrientation$: Observable<StepperOrientation>;

  welcomeForm = this._fb.group({});
  patientForm = this._fb.group({});
  termsForm = this._fb.group({});

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
