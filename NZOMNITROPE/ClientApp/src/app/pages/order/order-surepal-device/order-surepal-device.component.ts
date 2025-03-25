import { Component, DestroyRef, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { StepperOrientation } from '@angular/cdk/stepper';
import { Observable, finalize, map, tap } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { AddressComponent } from "../../../components/address/address.component";
import { GetPatientInformationWithCarerResponse, PatientServiceProxy, RegisterPapPatientDto, RegistrationMethod } from 'src/app/services/service-proxies/service-proxies';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatStepper } from '@angular/material/stepper';
import { RepeatOption } from 'src/app/utils/enums/ofev-data';
import { routeLinks } from 'src/app/utils/routes';
import { Router, RouterLink } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { OrderFormComponent } from './order-form/order-form.component';
import { PatientFormComponent } from 'src/app/components/patient-form/patient-form.component';

@Component({
  selector: 'app-order-surepal-device',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    RouterLink,
    AddressComponent,
    PatientFormComponent,
    OrderFormComponent,
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
  establishmentOnly = false;
  _destroyRef = inject(DestroyRef);
  patientModel: GetPatientInformationWithCarerResponse;

  // forms
  patientForm = this._fb.group({});
  addressForm = this._fb.group({});
  orderForm = this._fb.group({});

  constructor(
    private readonly _fb: FormBuilder,
    private readonly _breakpointObserver: BreakpointObserver,
    private readonly patientService: PatientServiceProxy,
    private readonly _authService: AuthenticationService,
    private readonly _router: Router,
  ) {
    this.stepperOrientation = this._breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }

  onEstablishmentOnlyChange(event: any): void {
    this.establishmentOnly = event.value;
  }

  onAddressFormCreated(form: FormGroup): void {
    this.addressForm = form;
  }

    private getPatientInformation(): void {
      this.patientService.getPatientInformationWithCarer()
        .pipe(
          takeUntilDestroyed(this._destroyRef),
          tap((response) => {
            if(response.isSuccess){
              this.patientModel = response.resultObject;
              this.updatePatientForm(this.patientModel);
            }
          })
        )
        .subscribe(({
          next: (result) => {
            if(result.isSuccess){
              this.patientModel = result.resultObject;
            }
          },
          error: (error) => {
            console.error('Error fetching patient information:', error);
          }
        }));
    }

    private updatePatientForm(data: GetPatientInformationWithCarerResponse): void {
      const patientFormData = {
        firstName: data.firstName,
        lastName: data.lastName,
        nhiNumber: data.nationalHealthIndex,
        email: data.email,
        mobile: data.mobileNumber,
      }
      this.patientForm.patchValue(patientFormData);
    }

  onPatientFormNext() {
    const patientFormData = this.patientForm.value as any;
    this.patientForm.markAllAsTouched();
    this.addressForm.markAllAsTouched();
    if (this.patientForm.valid) {
      this.stepper.next();
    }  
  }

  onFormSubmit() {
    this.submitting = true;
    const orderFormData = this.orderForm.value as any;
    const patientFormData = this.patientForm.value as any;
  }
}
