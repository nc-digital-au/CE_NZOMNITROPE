import { Component, DestroyRef, inject, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { StepperOrientation } from '@angular/cdk/stepper';
import { Observable, finalize, map } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { SvgIconComponent } from 'angular-svg-icon';
import { PrescriptionComponent } from '../prescription/prescription.component';
import { AddressComponent } from "../../../components/address/address.component";
import { PatientServiceProxy, RegisterPapPatientDto, RegistrationMethod } from 'src/app/services/service-proxies/service-proxies';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatStepper } from '@angular/material/stepper';
import { RepeatOption } from 'src/app/utils/enums/ofev-data';
import { routeLinks } from 'src/app/utils/routes';
import { Router, RouterLink } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { PatientFormComponent } from './patient-form/patient-form.component';
import { OrderFormComponent } from './order-form/order-form.component';

@Component({
  selector: 'app-order-surepal-device',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    RouterLink,
    SvgIconComponent,
    PrescriptionComponent,
    AddressComponent,
    PatientFormComponent,
    OrderFormComponent
  ],
  templateUrl: './order-surepal-device.component.html',
  styleUrl: './order-surepal-device.component.scss'
})
export class OrderSurepalDeviceComponent {
  @ViewChild('stepper')
  stepper: MatStepper;

  destroyRef = inject(DestroyRef);
  enrolmentSuccess = false;
  stepperOrientation: Observable<StepperOrientation>;
  patientId: string;
  routeLinks = routeLinks;
  submitting = false;

  // forms
  patientForm = this._fb.group({});
  orderForm = this._fb.group({});

  get patientAge(): number {
    if (this.patientForm && this.patientForm.controls['dateOfBirth']) {
      const dateOfBirthControl = this.patientForm.controls['dateOfBirth'];
      if (dateOfBirthControl.value) {
        const dateOfBirth = dateOfBirthControl.value as Date;
        const age = new Date().getFullYear() - dateOfBirth.getFullYear();
        return age;
      }
    }
    return 0;
  }

  constructor(
    private readonly _fb: FormBuilder,
    private readonly _breakpointObserver: BreakpointObserver,
    private readonly _patientService: PatientServiceProxy,
    private readonly _authService: AuthenticationService,
    private readonly _router: Router,
  ) {
    this.stepperOrientation = this._breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }

  onPrescriptionDownloaded(): void {
    this._router.navigate([routeLinks.patients.dashboard]);
  }

  onPatientFormNext() {
    this.stepper.next();
  }

  onFormSubmit() {
    // if (this.eligibilityForm.valid && this.patientForm.valid && this.prescriptionForm.valid && this.deliveryForm.valid && this.termsForm.valid) {
    //   const patientData = this.patientForm.value as any;
    //   const prescriptionData = this.prescriptionForm.value as any;
    //   const deliveryData = this.deliveryForm.value as any;
    //   const termsData = this.termsForm.value as any;

    //   this.submitting = true;
    //   this._patientService.patient(new RegisterPapPatientDto({
    //     registrationMethod: RegistrationMethod.PortalWebForm,

    //     programEligibilityCriteriaConfirmed: true,
    //     eligibilityCriteriaOptions: [1, 2, 3, 4],

    //     prescriberNumber: patientData.prescriberNumber,
    //     prescriberId: undefined,
    //     title: patientData.title,
    //     firstName: patientData.firstName,
    //     lastName: patientData.lastName,
    //     dateOfBirth: patientData.dateOfBirth,
    //     gender: patientData.gender,
    //     phone: patientData.phone,
    //     mobile: patientData.mobile,
    //     enrolledOn: new Date(),

    //     dosageId: prescriptionData.dose,
    //     repeats: RepeatOption.Five,
    //     prescriptionInstructions: prescriptionData.instructions,

    //     deliveryUnitNumber: deliveryData.unitNumber,
    //     deliveryAddressLine1: deliveryData.streetAddress,
    //     deliveryCity: deliveryData.city,
    //     deliveryState: deliveryData.state,
    //     deliveryPostcode: deliveryData.postcode,

    //     privacyConsentProvided: termsData.privacyConsent,
    //     programTermsAgreed: termsData.carerConsent,
    //     contactConsentProvided: false,
    //     marketingCommunicationConsentProvided: false,
    //     adverseEventContactConsentProvided: false,

    //     // ignore
    //     deliveryAddressLine2: undefined,
    //     middleName: undefined,
    //     email: undefined,
    //     homeUnitNumber: undefined,
    //     homeAddressLine1: undefined,
    //     homeAddressLine2: undefined,
    //     homeCity: undefined,
    //     homeState: undefined,
    //     homePostcode: undefined,
    //     currentUserId: undefined,
    //     pharmacyId: undefined,
    //     clinicId: undefined,
    //     programInformationReceived: undefined,
    //     supportProgramAccessRequested: undefined,
    //     treatmentStartedOn: undefined,
    //   })).pipe(
    //     takeUntilDestroyed(this.destroyRef),
    //     finalize(() => {
    //       this.submitting = false;
    //     }),
    //   ).subscribe({
    //     next: (result) => {
    //       this.patientId = result.resultObject;
    //       this.enrolmentSuccess = result.isSuccess;
    //       this._authService.currentUser?.storePrescriberNumber(patientData.prescriberNumber);
    //     },
    //   });
    // }
  }
}
