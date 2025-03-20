import { BreakpointObserver } from '@angular/cdk/layout';
import { AsyncPipe } from '@angular/common';
import { Component, DestroyRef, inject, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatStepper, MatStepperModule, StepperOrientation } from '@angular/material/stepper';
import { RouterLink } from '@angular/router';
import { map, Observable } from 'rxjs';
import { InlineAlertComponent } from 'src/app/components/inline-alert/inline-alert.component';
import { ValidationProblemDetail } from 'src/app/interceptors/error.interceptor';
import { RegistrationServiceProxy } from 'src/app/services/service-proxies/service-proxies';
import { routeLinks } from 'src/app/utils/routes';


@Component({
  selector: 'app-patient-registration',
  standalone: true,
  imports: [
    MatCardModule,
    MatStepperModule,
    InlineAlertComponent,
    MatButton,
    RouterLink,
    AsyncPipe
  ],
  templateUrl: './patient-registration.component.html',
  styleUrl: './patient-registration.component.scss'
})
export class PatientRegistrationComponent {
  @ViewChild('stepper')
    stepper: MatStepper;
  
    routeLinks = routeLinks;
    stepperOrientation$: Observable<StepperOrientation>;
  
    welcomeForm = this._fb.group({});
    patientForm = this._fb.group({});
    guardianForm = this._fb.group({});
    collectingForm = this._fb.group({});
    addressForm = this._fb.group({});
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

    onRegisterClick(): void {}
    
}
